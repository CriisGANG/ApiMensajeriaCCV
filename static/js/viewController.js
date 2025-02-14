
const pantallas = [{key:"chats", value: "p-chats"},{key:"users", value: "p-users"}, {key:"login", value: "p-login"}]


function show(target){

    pantallas.forEach(pantalla => {
        if(pantalla.key === target){
            document.getElementById(pantalla.value).style.display = 'block';
        }else{
            document.getElementById(pantalla.value).style.display = 'none';

        }
    }); 

    
}

export {show}

