document.addEventListener("DOMContentLoaded", function () {

    getAllComments();


    const postbtn = document.querySelector("#post-btn")
    postbtn.onclick = async () => {
        let textarea_ = document.querySelector('#post_content').value.trim()
        if (textarea_.length > 0) {
            await fetch('/upload/post', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    post_data: textarea_
                })
            })
                .then(res => res.json())
                .then(response => {
                    if (response.status == 0) {
                        console.log(`Status:${response.message}`)
                    }
                    else if (response.status == 1) {
                        getLastComment();
                    }
                })
                .catch(err => console.log(err))
            document.querySelector('#post_content').value = '';
        }
        else { return; }
    }

    async function getAllComments() {
        await fetch('/allcomments')
            .then(response => response.json())
            .then(response => {
                let op = ``;
                if (response.status == 0) {
                    console.log(`Status:${response.message}`)
                }
                else if (response.status == 1) {
                    const container = document.querySelector('.container');
                    for (let i in response.posts) {
                        console.log(response.posts[i].post)
                        op += `<p>${response.posts[i].post}</p>`
                    }
                }
                document.getElementById('posts').innerHTML = op;

            })
            .catch(err => console.log(err))

    }



    async function getLastComment() {
        const container = document.querySelector('.container');
        await fetch('/lastfetch')
            .then(response => response.json())
            .then(response => {
                let op = ``;
                if (response.status == 0) {
                    console.log(`Status:${response.message}`)
                }
                else if (response.status == 1) {
                    var p = document.createElement('p')
                    p.innerText = response.post.post
                }
                document.querySelector('#posts').prepend(p)

            })
            .catch(err => console.log(err))

    }

    var source = new EventSource("/stream");
    source.addEventListener('new_post', function (event) {
        var data = JSON.parse(event.data);
        console.log(data.post.post)
        var p = document.createElement('p')
        p.innerText = data.post.post
        document.querySelector('#posts').prepend(p)
    }, false);


});