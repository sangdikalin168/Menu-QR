import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { useState } from "react"

export const UserRolePermission = () => {
    // Sample Data
    const [users, setUsers] = useState([
        { id: 1, name: "John Doe", username: "john_doe", role: "Admin" },
        { id: 2, name: "Jane Smith", username: "jane_smith", role: "Editor" },
    ])

    const [roles, setRoles] = useState([
        { id: 1, name: "Admin", description: "Full access" },
        { id: 2, name: "Editor", description: "Can edit content" },
    ])

    const [permissions, setPermissions] = useState([
        { id: 1, name: "Create Post", description: "Can create new posts" },
        { id: 2, name: "Edit Post", description: "Can edit existing posts" },
        { id: 3, name: "Delete Post", description: "Can delete posts" },
    ])

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        role: "",
        roleName: "",
        roleDescription: "",
        permissionName: "",
        permissionDesc: "",
    })

    const [activeTab, setActiveTab] = useState("users")
    const [openDialog, setOpenDialog] = useState("")
    const [editingItem, setEditingItem] = useState(null)

    const handleOpenDialog = (type, item = null) => {
        if (item) {
            setEditingItem(item)
            setFormData({
                name: item.name || "",
                username: item.username || "",
                role: item.role || "",
                roleName: item.name || "",
                roleDescription: item.description || "",
                permissionName: item.name || "",
                permissionDesc: item.description || "",
            })
        }
        setOpenDialog(type)
    }

    const handleSave = () => {
        switch (openDialog) {
            case "user":
                if (editingItem) {
                    setUsers(users.map(u => u.id === editingItem.id ? { ...u, ...formData } : u))
                } else {
                    const newUser = {
                        id: users.length + 1,
                        name: formData.name,
                        username: formData.username,
                        role: formData.role,
                    }
                    setUsers([...users, newUser])
                }
                break
            case "role":
                if (editingItem) {
                    setRoles(roles.map(r => r.id === editingItem.id ? { ...r, name: formData.roleName, description: formData.roleDescription } : r))
                } else {
                    const newRole = {
                        id: roles.length + 1,
                        name: formData.roleName,
                        description: formData.roleDescription,
                    }
                    setRoles([...roles, newRole])
                }
                break
            case "permission":
                if (editingItem) {
                    setPermissions(permissions.map(p => p.id === editingItem.id ? { ...p, name: formData.permissionName, description: formData.permissionDesc } : p))
                } else {
                    const newPerm = {
                        id: permissions.length + 1,
                        name: formData.permissionName,
                        description: formData.permissionDesc,
                    }
                    setPermissions([...permissions, newPerm])
                }
                break
        }
        setOpenDialog("")
        setEditingItem(null)
    }

    return (
        <div className="w-full px-4 py-6">
            <h1 className="text-3xl font-bold mb-6">User Role & Permission Management</h1>

            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="roles">Roles</TabsTrigger>
                    <TabsTrigger value="permissions">Permissions</TabsTrigger>
                </TabsList>

                {/* Users Tab */}
                <TabsContent value="users">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Users</CardTitle>
                                <CardDescription>Manage all system users</CardDescription>
                            </div>
                            <Dialog open={openDialog === "user"} onOpenChange={() => setOpenDialog("")}>
                                <DialogTrigger asChild>
                                    <Button onClick={() => handleOpenDialog("user")}>Add User</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{editingItem ? "Edit User" : "Add User"}</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="name" className="text-right">Name</Label>
                                            <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="col-span-3" />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="username" className="text-right">Username</Label>
                                            <Input id="username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="col-span-3" />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="role" className="text-right">Role</Label>
                                            <Select value={formData.role} onValueChange={(val) => setFormData({ ...formData, role: val })}>
                                                <SelectTrigger className="col-span-3">
                                                    <SelectValue placeholder="Select Role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {roles.map(role => (
                                                        <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleSave}>Save</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Username</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map(user => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.username}</TableCell>
                                            <TableCell>{user.role}</TableCell>
                                            <TableCell>
                                                <Button variant="outline" size="sm" onClick={() => handleOpenDialog("user", user)}>Edit</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Roles Tab */}
                <TabsContent value="roles">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Roles</CardTitle>
                                <CardDescription>Manage user roles and permissions</CardDescription>
                            </div>
                            <Dialog open={openDialog === "role"} onOpenChange={() => setOpenDialog("")}>
                                <DialogTrigger asChild>
                                    <Button onClick={() => handleOpenDialog("role")}>Add Role</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{editingItem ? "Edit Role" : "Add Role"}</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="roleName" className="text-right">Name</Label>
                                            <Input id="roleName" value={formData.roleName} onChange={(e) => setFormData({ ...formData, roleName: e.target.value })} className="col-span-3" />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="roleDesc" className="text-right">Description</Label>
                                            <Input id="roleDesc" value={formData.roleDescription} onChange={(e) => setFormData({ ...formData, roleDescription: e.target.value })} className="col-span-3" />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleSave}>Save</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Role Name</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {roles.map(role => (
                                        <TableRow key={role.id}>
                                            <TableCell>{role.name}</TableCell>
                                            <TableCell>{role.description}</TableCell>
                                            <TableCell>
                                                <Button variant="outline" size="sm" onClick={() => handleOpenDialog("role", role)}>Edit</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Permissions Tab */}
                <TabsContent value="permissions">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Permissions</CardTitle>
                                <CardDescription>Manage available permissions</CardDescription>
                            </div>
                            <Dialog open={openDialog === "permission"} onOpenChange={() => setOpenDialog("")}>
                                <DialogTrigger asChild>
                                    <Button onClick={() => handleOpenDialog("permission")}>Add Permission</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{editingItem ? "Edit Permission" : "Add Permission"}</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="permName" className="text-right">Name</Label>
                                            <Input id="permName" value={formData.permissionName} onChange={(e) => setFormData({ ...formData, permissionName: e.target.value })} className="col-span-3" />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="permDesc" className="text-right">Description</Label>
                                            <Input id="permDesc" value={formData.permissionDesc} onChange={(e) => setFormData({ ...formData, permissionDesc: e.target.value })} className="col-span-3" />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleSave}>Save</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Permission Name</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {permissions.map(permission => (
                                        <TableRow key={permission.id}>
                                            <TableCell>{permission.name}</TableCell>
                                            <TableCell>{permission.description}</TableCell>
                                            <TableCell>
                                                <Button variant="outline" size="sm" onClick={() => handleOpenDialog("permission", permission)}>Edit</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}