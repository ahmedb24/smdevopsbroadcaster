module.exports = async function showRoom(req, res) {
    try {
        res.render('room', { roomId: req.params.room, action: req.query.action, name: req.query.name });
    } catch (error) {
        console.error(error);
    }
}
