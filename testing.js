new Promise( (resolve, reject) => {
    let i = "Lorem ipsum dolor sit amet";
    resolve(i);
})
.then(s => {
    console.log(s);
})