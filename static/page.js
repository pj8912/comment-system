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
                    getAllComments();
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
                    op += `${response.posts[i].post}<br>`
                }
            }
            document.getElementById('posts').innerHTML = op;

        })
        .catch(err => console.log(err))
}


document.addEventListener("DOMContentLoaded", function () {
    getAllComments();
});
