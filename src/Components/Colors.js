/* Class to stores activites and their colors. Used by all of the front-end */
class Colors {

    /* Returns a list of activities */
    getActivities() {
        return ["Sleep", "Work", "Food", "Exercise", "Class", "Entertainment", "Friends", "Hygiene", "Driving"];
    }

    /* Returns a list of color in order to correspond to activities */
    getColors() {
        return(['#3F7CAC',
                '#392B58',
                '#99D5C9',
                '#2D0320',
                '#E76F51',
                '#87BBA2',
                '#F0F7EE',
                '#FFF07C',
                '#F46197']);
    }
}

export default new Colors();