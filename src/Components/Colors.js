/* Class to stores activites and their colors. Used by all of the front-end */
class Colors {

    /* Returns a list of activities */
    getActivities() {
        return ["Sleep", "Work", "Food", "Exercise", "Class", "Entertainment", "Friends"];
    }

    /* Returns a list of color in order to correspond to activities */
    getColors() {
        return(['#6b486b',
            '#d0743c',
            '#8a89a6',
            '#3c6fc2',
            '#A0232C',
            '#7E99C2',
            '#C2A361']);
    }
}

export default new Colors();