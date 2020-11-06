// ****** SELECT ITEMS **********
const alertMessage = document.querySelector('.alert')
const form = document.querySelector('.grocery-form')
const grocery = document.getElementById('grocery')
const submitBtn = document.querySelector('.submit-btn')
const container = document.querySelector('.grocery-container')
const list = document.querySelector('.grocery-list')
const clearBtn = document.querySelector('.clear-btn')

// edit option
let editElement;
let editFlag = false;
let editId ="";

// ****** EVENT LISTENERS **********
form.addEventListener('submit', addItem)
// clear item
clearBtn.addEventListener('click', clearItems);
// load items from localStorage
window.addEventListener('DOMContentLoaded', setupItems)

// ****** FUNCTIONS **********
function addItem(e) { 
    e.preventDefault();
    // console.log(grocery.value);
    const value = grocery.value
    // console.log(value);
    const id = new Date().getTime().toString()
    // console.log(id);

    if (value /**!=='' */ && !editFlag /**=== false */) {
        // console.log("add item to the list");
        createListItems(id, value)
        displayAlert('action ajouté à la liste','success');

        addToLocalStorage(id,value)
        setBackToDefault()
    // show container
    container.classList.add('show-container')

    }else if (value /**!=='' */ && editFlag/** === true */) {
        // console.log('editing');
        editElement.innerHTML = value;
        displayAlert('action Modifiée','success')
        editLocalStorage(editId,value)
        setBackToDefault()
    }else{
        // console.log("empty value");
        displayAlert('Veuillez entrer une action','danger')
    }
}

function setBackToDefault() {
    //   console.log('set back to default');  
    grocery.value ="";
    editFlag = false;
    editId = '';
    submitBtn.textContent = 'submit'
}
//clear total items
function clearItems(){
    const items = document.querySelectorAll('.grocery-item');

    if (items.length > 0) {
        items.forEach((item) => {
            list.removeChild(item)
        });
    }
    container.classList.remove('show-container')
    displayAlert('liste vidée','danger')
    setBackToDefault()
    // efface tous les items de la list
    localStorage.removeItem('list')
}


//delete one item
function deleteItem(e){
    const el = e.currentTarget.parentElement.parentElement;
    const id = el.dataset.id;
    console.log(id);
    list.removeChild(el)
    // console.log('item deleting');
    if (list.children.length === 0) {
        container.classList.remove('show-container')
    }
    displayAlert('action supprimée','danger')
    setBackToDefault()
    removeFromLocalStorage(id)
}

//edit one item
function editItem(e){
    const el = e.currentTarget.parentElement.parentElement;
    // set edit item
    editElement = e.currentTarget.parentElement.previousElementSibling;
    // set form value
    grocery.value = editElement.innerHTML
    editFlag = true;
    editId = el.dataset.id;
    submitBtn.textContent = 'edit'

    // console.log('item editing');
}


function displayAlert(text,action) {
    alertMessage.textContent = text;
    alertMessage.classList.add(`alert-${action}`)

    setTimeout(() => {
        alertMessage.textContent = "";
        alertMessage.classList.remove(`alert-${action}`)
    },1000);
}
// ****** LOCAL STORAGE **********
function addToLocalStorage(id,value){
    // console.log('add to local storage');
    const grocery = {id:id,value:value}
    // console.log(grocery);
    let items = getLocalStorage()
    items.push(grocery);
    localStorage.setItem('list', JSON.stringify(items))
    // console.log(items);
}
function removeFromLocalStorage(id){
    let items = getLocalStorage()
    console.log(items);
    items = items.filter(function(item) {
        // console.log(item.id);
        if (item.id !== id) {
            // console.log(item);
            return item;
        }
    })
    localStorage.setItem('list',JSON.stringify(items))
}
function  editLocalStorage(id, value){
    let items = getLocalStorage();
    items = items.map((item) => {
        if (item.id === id) {
            item.value = value
        }
        return item;

    });
    localStorage.setItem('list',JSON.stringify(items))

}
function  getLocalStorage(){
    return localStorage.getItem("list")?JSON.parse(localStorage.getItem("list")):[];
}
// ****** SETUP ITEMS **********
function setupItems(){
    let items = getLocalStorage();
    if (items.length > 0) {
        items.forEach((item) => {
            createListItems(item.id,item.value)
        })
        container.classList.add('show-container')
    }
}

function createListItems(id, value){
    const element = document.createElement('article')
    element.classList.add('grocery-item')
    const attr = document.createAttribute('data-id')
    attr.value = id;
    element.setAttributeNode(attr)
    element.innerHTML = `<p class="title">${value}</p>
        <div class="btn-container">
        <!-- edit btn -->
        <button type="button" class="edit-btn">
            <i class="fas fa-edit"></i>
        </button>
        <!-- delete btn -->
        <button type="button" class="delete-btn">
            <i class="fas fa-trash"></i>
        </button>
        </div>`;

    // delete btn
    const deleteBtn = element.querySelector('.delete-btn')
    deleteBtn.addEventListener('click', deleteItem);
    // edit item
    const editBtn = element.querySelector('.edit-btn')
    editBtn.addEventListener('click', editItem);

    //append children
    list.appendChild(element);
}