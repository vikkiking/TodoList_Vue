var unfinished = document.getElementById('unfinished')
var finished = document.getElementById('finished')
var Bin = document.getElementById('Bin')
var workplace = document.getElementById('workplace')
var Task = [], priority = []
var count = -1
var myStorage = window.localStorage
window.onload = function () {
    init()
}

function newTask() {
    return {
        number: undefined,
        checked: false,
        binned: false,
        content: '',
        priority: 0
    }
}

function addTask(ID = -1) {
    if (count >= 0 && JSON.parse(myStorage.getItem(count)).content === '') return;
    let card = (document.getElementsByTagName('li'))[0]
    card.onmouseenter(card)
    let newDiv = document.createElement('div'),
        newContent = document.createElement("div"),
        newPanel = document.createElement('div'),
        checkbox = document.createElement('input'),
        del = document.createElement('img'),
        rec = document.createElement('img')
    rec.src = 'img/recover.svg'
    rec.setAttribute('onclick', 'recover(this.parentNode.parentNode)')
    rec.classList.add('hide')
    rec.classList.add('recover')
    del.src = 'img/delTask.svg'
    del.classList.add('hide')
    del.classList.add('del')
    del.setAttribute('onclick', 'delTask(this.parentNode.parentNode)')
    checkbox.type = 'checkbox'
    checkbox.setAttribute('onclick', 'status(this.parentNode.parentNode)')
    newContent.contentEditable = 'true'
    newContent.setAttribute('onblur', 'saveContent(this)')
    newPanel.appendChild(checkbox)
    newPanel.appendChild(del)
    newPanel.appendChild(rec)
    newDiv.setAttribute('onmouseover', 'vis(this)')
    newDiv.setAttribute('onmouseleave', 'hide(this)')
    newDiv.appendChild(newContent)
    newDiv.appendChild(newPanel)
    newDiv.classList.add('task')
    let t = newTask()
    t.name = ID >= 0 ? ID : ++count
    count = ID > count ? ID : count
    Task.push(t)
    newDiv.id = t.name.toString()
    unfinished.appendChild(newDiv)
    if (ID === -1) myStorage.setItem(t.name.toString(), JSON.stringify(t))
    return newDiv
}

function saveContent(cur) {
    let t = JSON.parse(myStorage.getItem(cur.parentNode.id))
    t.content = cur.innerText
    myStorage.setItem(cur.parentNode.id, JSON.stringify(t))
}

function vis(cur) {
    for (let i = 0; i < 2; i++) (cur.lastChild.children)[i].classList.remove('hide')
    if (cur.parentNode === Bin) (cur.lastChild.children)[2].classList.remove('hide')
}

function hide(cur) {
    for (let i = 0; i < 3; i++) (cur.lastChild.children)[i].classList.add('hide')
}

function delTask(curTask) {
    if (curTask.parentNode === Bin) {
        if (!confirm('确定要删除该任务吗？')) return;
        myStorage.removeItem(curTask.id)
        Bin.removeChild(curTask)
    } else {
        (curTask.lastChild.children)[0].setAttribute('disabled', 'disabled')
        Bin.appendChild(curTask)
        curTask.firstChild.contentEditable = false
        let t = JSON.parse(myStorage.getItem(curTask.id))
        t.binned = true
        myStorage.setItem(curTask.id, JSON.stringify(t))
    }
}

function recover(curTask) {
    (curTask.lastChild.children)[0].removeAttribute('disabled')
    let t = JSON.parse(myStorage.getItem(curTask.id))
    t.binned = false
    if (t.checked) finished.appendChild(curTask)
    else {
        unfinished.appendChild(curTask)
        curTask.firstChild.contentEditable = true
    }
    myStorage.setItem(curTask.id, JSON.stringify(t))
}

function status(curTask) {
    if ((curTask.lastChild.children)[0].checked && curTask.parentNode === unfinished) {
        finished.appendChild(curTask)
        curTask.firstChild.contentEditable = false
        let t = JSON.parse(myStorage.getItem(curTask.id))
        t.checked = true
        myStorage.setItem(curTask.id, JSON.stringify(t))
    } else if (!((curTask.lastChild.children)[0].checked) && curTask.parentNode === finished) {
        unfinished.appendChild(curTask)
        curTask.firstChild.contentEditable = true
        let t = JSON.parse(myStorage.getItem(curTask.id))
        t.checked = false
        myStorage.setItem(curTask.id, JSON.stringify(t))
    }
}

function init() {
    //myStorage.clear()
    let i = 0
    while (i < myStorage.length) {
        let getTask = JSON.parse(myStorage.getItem(myStorage.key(i)))
        if (getTask.content === '') myStorage.removeItem(getTask.name)
        else {
            let t = addTask(parseInt(getTask.name));
            t.firstChild.innerText = getTask.content;
            if (getTask.checked) (t.lastChild.children)[0].setAttribute('checked', 'checked')
            else (t.lastChild.children)[0].removeAttribute('checked')
            if (getTask.binned) Bin.appendChild(t)
            else if (getTask.checked) finished.appendChild(t)
            else unfinished.appendChild(t)
            i++
        }
    }
}

function choose(k) {
    let temp = k.parentNode.children,
        wp = document.getElementById('workplace').children
    for (let i = 0; i < 3; i++) {
        if (k === temp[i]) {
            (temp[i].children)[1].style.backgroundColor = '#a4e2c6'
            wp[i].classList.remove('hide');
            (temp[i].children)[1].classList.remove('scale2');
            (temp[i].children)[1].classList.add('scale1')
        } else {
            //(temp[i].children)[1].style.backgroundColor = 'transparent';
            (temp[i].children)[1].classList.remove('scale1');
            (temp[i].children)[1].classList.add('scale2')
            wp[i].classList.add('hide')
        }
    }
}