const URL = "https://mi-sistema-gestion-tareas-default-rtdb.firebaseio.com/"

/*{
    name: "Tarea 1",
    description: "Descripcion de la tarea 1",
    status: "pendiente",
}*/

async function postData(event){
    event.preventDefault();
    const name = event.target.name.value;// mi primera tarea | ""
    const description = event.target.description.value;

    const task = {
        name,
        description,
        status: "pending"
    }

    // async y await
    const res = await fetch(`${URL}tasks.json`, {
        method: "POST",
        body: JSON.stringify(task)
    })

    if(res){
        event.target.reset()
        const closeModal = document.getElementById("my_modal_7")
        alert("Tarea Creada")
        closeModal.click()
        loadData()
        window.location.reload()
        
    }else{
        alert("Tarea no creada")
    }
}


async function loadData(){
    const res = await fetch(`${URL}tasks.json`)
    const tasks = await res.json()
    const app = document.getElementById("app")
    for(const key in tasks){
        const container = document.createElement("div")
        const task = tasks[key]
        container.className = "flex w-full"
        container.innerHTML = `
        <div class="flex flex-1 gap-3">
            <p
                class="flex-1 flex justify-center items-center border-2  rounded-md text-[#06b6d4] font-bold text-lg text-center px-3 ${task.status === "pending"? "set-box-shadow-onPending border-rose-500": "set-box-shadow-onCompleted border-[#00cdb7] opacity-25 italic line-through"}">
                ${task.name}
                ${task.description}
            </p>
            <div class="grid grid-cols-1 gap-2 w-[4rem]">
                <button onclick="handleStatus('${key}')" class="btn btn-success h-full">
                    <svg class="w-6 h-6 text-dark" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                        height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M5 11.917 9.724 16.5 19 7.5" />
                    </svg>
                </button>
                <button onclick="handleDelete('${key}')" class="btn btn-error h-full">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
        `
        app.appendChild(container)
    }
}

async function handleStatus(key){
    const res = await fetch(`${URL}tasks/${key}.json`)
    const task = await res.json()

    const updateTask = {
        ...task,
        status: task.status === "pending"? "completed": "pending"
    }

    const reponseUpdate = await fetch(`${URL}tasks/${key}.json`, {
        method: "PATCH", // PUT PATCH
        body: JSON.stringify(updateTask)
    })

    if(reponseUpdate.ok){
        alert("Tarea Actualizada")
        await loadData()
        window.location.reload()
    }else{
        alert("ERROR Tarea no Actualizada")
    }
    
}

async function handleDelete(key){
    const res = await fetch(`${URL}tasks/${key}.json`, {
        method:"DELETE"
    })

    if(res.ok){
        alert("Tarea Eliminada")
        await loadData()
        window.location.reload()
    }else{
        console.log("ERROR La Tarea no se elimino");
    }
}