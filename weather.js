
const express=require("express");
const https=require("https");
const bodyParser=require("body-parser");
const app=express();


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine" , "ejs")

app.get("/",function(req,res){
    res.sendFile(__dirname+"/weather.html");

});

app.post("/",function(req,res){

    var city=req.body.city;
    var units=req.body.units;
    var apiKey="70e2d528ec6c0af057b88dfd9b852d71#";

    const url="https://api.openweathermap.org/data/2.5/weather?q="+city+"&units="+units+"&appid="+apiKey;

    
    https.get(url,function(response){

        
        if (response.statusCode===200) {
            
            response.on("data",function(data){
                var today=new Date();
                var hour=today.getHours();
                var min=today.getMinutes();
                var sec=today.getSeconds();
            
                var option={ weekday:'long'  ,month: 'long' ,day:'numeric'}
                var date=today.toLocaleDateString('en-us',option);

                const weatherData= JSON.parse(data);
                const temp=weatherData.main.temp;
                const icon=weatherData.weather[0].icon;
                const discription=weatherData.weather[0].description;
                const imageUrl="http://openweathermap.org/img/wn/" + icon + "@2x.png";
                const cityName=weatherData.name;
                const feel=weatherData.main.feels_like;

                res.render("success" , {
                    City:cityName,
                    Date:date,
                    img:imageUrl,
                    Temp:temp,
                    RealFeel:feel

                });
            });

        } else {

            res.sendFile(__dirname+"/failure.html");
        }
        
        
    });
});

app.post("/failure",function(req,res) {
    res.redirect("/");
});



app.listen(process.env.PORT || "3000",function(){
    console.log("start");
    
});


