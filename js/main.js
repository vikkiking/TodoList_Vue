let del = './img/delTask.svg', rec = './img/recover.svg',
    myStorage = window.localStorage, count = -1,
    Default = document.getElementsByTagName('li')[0];

let unfinished = new Vue({
        el: '#unfinished',
        data: {
            tasks: {},
            hide: false,
            disabled: false,
            editable: true
        },
        methods: {
            add: function () {
                if (count >= 0 && this.tasks[count.toString()].content === '') return;
                let temp = {
                    content: ``,
                    id: (++count).toString(),
                    checked: false,
                    binned: false
                }
                this.$set(this.tasks, temp.id, temp)
                choose(Default)
            },
            delTask: function (cur) {
                cur.binned = true
                myStorage.setItem(cur.id, JSON.stringify(cur))
                bin.$set(bin.tasks, cur.id, cur)
                this.$delete(this.tasks, cur.id)
            },
            Done: function (cur) {
                cur.checked = !cur.checked
                finished.$set(finished.tasks, cur.id, cur)
                this.$delete(this.tasks, cur.id)
                myStorage.setItem(cur.id, JSON.stringify(cur))
            }
        },
    }),
    finished = new Vue({
        el: '#finished',
        data: {
            tasks: {},
            hide: true,
            disabled: false,
            editable: false
        },
        methods: {
            delTask: function (cur) {
                cur.binned = true
                myStorage.setItem(cur.id, JSON.stringify(cur))
                bin.$set(bin.tasks, cur.id, cur)
                this.$delete(this.tasks, cur.id)
            },
            cancel: function (cur) {
                cur.checked = !cur.checked
                unfinished.$set(unfinished.tasks, cur.id, cur)
                this.$delete(this.tasks, cur.id)
                myStorage.setItem(cur.id, JSON.stringify(cur))
            }
        }
    }),
    bin = new Vue({
        el: '#bin',
        data: {
            tasks: {},
            hide: false,
            disabled: true,
            editable: false
        },
        methods: {
            delTask: function (cur) {
                if (!confirm('确定删除吗？')) return;
                myStorage.removeItem(cur.id)
                this.$delete(this.tasks, cur.id)
            },
            recover: function (cur) {
                cur.binned = false
                myStorage.setItem(cur.id, JSON.stringify(cur))
                if (cur.checked) finished.$set(finished.tasks, cur.id, cur)
                else unfinished.$set(unfinished.tasks, cur.id, cur)
                this.$delete(this.tasks, cur.id)
            }
        }
    }),
    panels = [unfinished, finished, bin]
Vue.component('todo-item',
    {
        template: `
            <div>
                <div :contentEditable="editable" v-html="todo.content" @mouseleave="changeContent(todo,$event)">
                    {{todo.content}}
                </div>
                <div><input type="checkbox" :disabled="disabled"  class="hide" @click="deal(todo)" :checked="todo.checked">
                    <img :src=del class="del hide" @click="delTask(todo)">
                    <img :src=rec class="recover hide" @click="recover(todo)"></div>
            </div>`,
        props: ['todo', 'editable', 'disabled'],
        methods: {
            delTask: function (cur) {
                this.$emit('del-task', cur)
            },
            recover: function (cur) {
                this.$emit('recover', cur)
            },
            changeContent: function (cur, e) {
                cur.content = e.target.innerHTML.replace(/\n/g,"<br/>")
                myStorage.setItem(cur.id, JSON.stringify(cur))
            },
            deal: function (cur) {
                this.$emit('deal', cur)
            }
        }
    })

function choose(k) {
    let temp = k.parentNode.children
    for (let i = 0; i < 3; i++) {
        if (k === temp[i]) {
            (temp[i].children)[1].style.backgroundColor = '#a4e2c6'
            panels[i].hide = false;
            (temp[i].children)[1].classList.remove('scale2');
            (temp[i].children)[1].classList.add('scale1')
        } else {
            (temp[i].children)[1].classList.remove('scale1');
            (temp[i].children)[1].classList.add('scale2')
            panels[i].hide = true
        }
    }
}

function vis(cur) {
    for (let i = 0; i < 2; i++) cur.lastChild.children[i].classList.remove('hide')
    if (cur.parentNode === bin.$el) cur.lastChild.children[2].classList.remove('hide')
}

function hide(cur) {
    for (let i = 0; i < 3; i++) cur.lastChild.children[i].classList.add('hide')
}

function init() {
    let i = 0
    while (i < myStorage.length) {
        let getTask = JSON.parse(myStorage.getItem(myStorage.key(i)))
        if (getTask.content === '') myStorage.removeItem(getTask.id)
        else {
            if (getTask.binned) bin.$set(bin.tasks, getTask.id, getTask)
            else if (getTask.checked) finished.$set(finished.tasks, getTask.id, getTask)
            else unfinished.$set(unfinished.tasks, getTask.id, getTask)
            i++
        }
    }
    for (i = 0; i < myStorage.length; i++)
        count = Math.max(count, parseInt(myStorage.key(i)))
}