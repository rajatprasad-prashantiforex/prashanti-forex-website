// Cursor script neutralized to support simple, natural standard browser cursor
// as per user requirement: "Make the cursor simple no animation in cursor it should be like an simple cursor"
document.addEventListener("DOMContentLoaded", function() {
    var c = document.querySelector('.cursor');
    if (c) {
        c.style.display = 'none';
        if (c.parentNode) {
            c.parentNode.removeChild(c);
        }
    }
});