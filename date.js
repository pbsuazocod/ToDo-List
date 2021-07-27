exports.getDate = function () {
    const options = {
        weekday: "long",
        year: "numeric",
        month: 'long',
        day: 'numeric'
    };

    const date = event.toLocaleDateString(undefined, options);

    return date;

};