let author = '';
    message = '';

Vue.component('update_form', {
    template: `<form>
    <div>
        <label :for="comment.id + 'author'">Author</label>
        <input type="text" :id="comment.id + 'author'" v-model="comment.author">
    </div>
    <div>
        <label :for="comment.id + 'message'">Message</label>
        <textarea type="text" :id="comment.id + 'message'" v-model="comment.message"></textarea>
    </div>
    </form>`,
    props: ['comment']
})

Vue.component('comment', {
    template: `<div class="comment">
        <slot v-if="update_on"></slot>
        <strong>{{comment.author}}</strong>
        <pre>{{comment.message}}</pre>
        <a href="#" @click.prevent="deleteComment(comment.id)">delete</a>
        <span v-if="update_on">
            <a href="#" @click.prevent="save()">save</a>
            <a href="#" @click.prevent="cancel()">cancel</a>
        </span>
        <a href="#" v-else @click.prevent="startUpdate()">update</a>
        
    </div>`,
    data: function (){
        return {
            update_on: false
        }
    },
    props: ['comment', 'comments'],
    methods: {
        deleteComment(id) {
            Vue.delete(this.comments, id);
            localStorage.setItem('comments', JSON.stringify(this.comments));
        },
        startUpdate() {
            this.update_on = true;
            author = this.comment.author;
            message = this.comment.message;
        },
        save() {
            this.update_on = false;
            localStorage.setItem('comments', JSON.stringify(this.comments));
        },
        cancel() {
            this.update_on = false;
            this.comment.author = author;
            this.comment.message = message;

        }
    }
});

let comments_from_local = localStorage.getItem('comments');
if (comments_from_local == null) {
    comments_from_local = {};
}
else {
    comments_from_local = JSON.parse(comments_from_local);
}

let last_id = localStorage.getItem('last_id');
if (last_id == null) {
    last_id = 0;
}

let app = new Vue ({
    el: "#app",
    data: {
        header_message: "Hello, this is comment task with Vue JS!",
        mode: 'light',
        comments: comments_from_local,
        author: '',
        message: '',
        id: comments_from_local.length
    },
    methods: {
        setLight() {
            this.mode = 'light';
        },
        setDark() {
            this.mode = 'dark';
        },
        addComment() {
            let new_comment = {
                author: this.author,
                message: this.message,
                status: true,
                id: ++last_id
            };

            this.comments[last_id] = new_comment;

            this.author = '';
            this.message = '';
            
            localStorage.setItem('comments', JSON.stringify(this.comments));
            localStorage.setItem('last_id', last_id);
        }

    }
});