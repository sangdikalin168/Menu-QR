import fs from 'fs';
import path from 'path';

const modulesPath = __dirname;
const resolvers: any[] = [];
const typeDefs: string[] = [];

fs.readdirSync(modulesPath).forEach((moduleName) => {
    const folderPath = path.join(modulesPath, moduleName);
    if (fs.statSync(folderPath).isDirectory()) {
        // Look for any *.resolvers.ts and *.graphql file in the module folder
        const files = fs.readdirSync(folderPath);
        files.forEach((file) => {
            if (file.endsWith('.resolvers.ts')) {
                const resolverPath = path.join(folderPath, file);
                const moduleResolvers = require(resolverPath);
                resolvers.push(moduleResolvers.resolvers || moduleResolvers.default || moduleResolvers);
            }
            if (file.endsWith('.graphql')) {
                const typeDefPath = path.join(folderPath, file);
                const typeDefContent = fs.readFileSync(typeDefPath, 'utf8');
                typeDefs.push(typeDefContent);
            }
        });
    }
});

// Merge all resolver objects into one
function deepMergeResolvers(resolverList: any[]): any {
    return resolverList.reduce((acc, curr) => {
        Object.keys(curr).forEach((key) => {
            if (acc[key] && typeof acc[key] === 'object' && typeof curr[key] === 'object') {
                acc[key] = { ...acc[key], ...curr[key] };
            } else {
                acc[key] = curr[key];
            }
        });
        return acc;
    }, {});
}

const combinedResolvers = deepMergeResolvers(resolvers);
const combinedTypeDefs = typeDefs;
console.log('DEBUG combinedResolvers keys:', Object.keys(combinedResolvers));
console.log('DEBUG Query keys:', Object.keys(combinedResolvers.Query || {}));
console.log('DEBUG Mutation keys:', Object.keys(combinedResolvers.Mutation || {}));
console.log('DEBUG combinedTypeDefs count:', combinedTypeDefs.length);
export { combinedResolvers, combinedTypeDefs };

