class DayInfoInterface {

    postDayData(JSONObj) {
        const URL = "http://localhost:8080/api/LifeTime/postInformation";

        fetch(URL, {
            credentials: 'same-origin',
            method: 'URL',
            body: JSONObj,
            headers: {
                "content-type" : "application/json"
            }
        }).then(function(res){
            return res;
        })
    }
}

export default new DayInfoInterface();