var http = require("http");
var rp = require("request-promise");
var express = require("express");
var app = express();
var ejs = require("ejs");
var router = express.Router();


var moviedb = "http://api.themoviedb.org/3/discover/tv?api_key=6eea0576c85e5ebf9fd8e438a8d8b316&language=en-US&sort_by=popularity.desc&page=1&timezone=America/New_York&include_null_first_air_dates=false";
var film;
var film_json ='';
var perso;
var message;
var perso =[] ; 
router.route('/ville/:p1')

// get
.get(function(req, res) {
    
    var valeur = req.params.p1;
    var api_aqi = "https://api.waqi.info/feed/"+ valeur +"/?token=fe74e0b525908d08ff696aabce918b22ff096fee" ;
    var aqi_response;
    var moviedb_response;
    var film_list = [];
    var ville_list = [];

   rp.get(api_aqi)
   .then( function(response) {
        if(response) {
            aqi_response = JSON.parse(response);
            return rp.get(moviedb);
        } else {
            res.send("No data available");
        }
   })
   .then( function(response) {
       if(response) {
            
                moviedb_response = JSON.parse(response);
                var size = Object.keys(moviedb_response["results"]).length;
                
                for ( i = 0 ; i <= size -1 ; i++) {

                film_list[i]= moviedb_response["results"][i]["name"];
            }
            if (aqi_response["data"]["aqi"] < 50) {
                message = "Ne rester pas enfermer chez vous sorter prendre l'air."
                film_list =[];
            } else {
                message = "regardez un serie l'indice de pollution est important"
            }
                console.log(size);
        
                perso = ({ aqi: aqi_response["data"]["idx"],
                pollution:  aqi_response["data"]["aqi"],
                name : aqi_response["data"]["city"]["name"],
                temp : aqi_response["data"]["iaqi"]["t"]["v"],
                donnee:film_list, 
                message: message});
var serie;
                if(perso.pollution > 50) {
                    serie = "<ul>" ;
                    for (i = 0 ; i<= (perso.donnee).length -1 ;i ++) {
                      serie = serie + " <li>" + perso.donnee[i] + "</li>";
                    }
                    serie = serie + "</ul>";
                }else {
                        serie ="";
                }

                res.end(
                    "<h1> "+ perso.name + " </h1> </br> <p> pollution : "
                     + perso.pollution  +"</br>"+  " temp : " +perso.temp +" </p>" + "<p> " + perso.message + "</p>" 
                     +serie
                );
        } else {
            res.send("No data available");
        }
   })
   .catch( function(error) {
        res.send("une erreur a était trouvé : " + error);
   });
  
  
  
})

router.route('/')
// all permet de prendre en charge toutes les méthodes. 
.get(function(req,res){ 
      res.json({
              message : " liste des ville",
        id: "1",
        pollution : "53",
        ville : "maville",
        methode : req.method})
})

// Nous demandons à l'application d'utiliser notre routeur
app.use(router);  


var port = 1337
app.listen(port, function() {
    console.log("server running on port 1337");
});
