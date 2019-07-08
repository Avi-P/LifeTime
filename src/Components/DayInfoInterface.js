class DayInfoInterface {
    fetchDayData(date){
        const URL = "http://localhost:8080/api/LifeTime/getInformation";

        const data = {
            date: date
        };

        fetch(URL, {
            credentials: 'same-origin',
            method: 'URL',
            body: JSON.stringify(data),
            headers: {
                "content-type" : "application/json"
            }
        }).then(function(res) {
            return res.json();
        }).then (function (transformedRes){
            let {response} = transformedRes;

            let data = [];

            for(let i = 0; i < response["activityMap"].length; i++) {

                data.push({
                    time: (response["activityMap"][i]["time_out"] - response["activityMap"][i]["time_in"]),
                    activity: response["activityMap"][i]["activity"]
                });
            }

            return data;
        });
    }

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