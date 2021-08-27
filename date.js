function getDate() {
    const event = new Date();

    const options = {
        weekday: "long",
        year: "numeric",
        month: 'long',
        day: 'numeric'
    };

    return event.toLocaleDateString("en-US", options);
};

export default getDate;