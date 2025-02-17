import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const users = [
  { id: 1, name: "Usuario 1" },
  { id: 2, name: "Usuario 2" },
  { id: 3, name: "Usuario 3" }
];

export default function CreateGroupPopup() {
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupImage, setGroupImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setGroupImage(URL.createObjectURL(file));
    }
  };

  const handleUserSelection = (value) => {
    setSelectedUsers((prev) =>
      prev.includes(value) ? prev.filter((user) => user !== value) : [...prev, value]
    );
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Crear Grupo</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear un nuevo grupo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input 
              placeholder="Nombre del Grupo" 
              value={groupName} 
              onChange={(e) => setGroupName(e.target.value)}
            />
            <Select multiple onValueChange={handleUserSelection}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar usuarios" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.name}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {groupImage && <img src={groupImage} alt="Imagen del grupo" className="w-20 h-20 rounded-full" />}
            <Button onClick={() => console.log("Grupo creado:", { groupName, selectedUsers, groupImage })}>
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
