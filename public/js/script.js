// here we write our frontend js script 

const socket = io(); //initializing socket io >> it send the connection request to the backend

if(navigator.geolocation){  //checking wheather the browser support geolocation or not || navigator object is in the window which contain verious information about the features of browsers
    navigator.geolocation.watchPosition((position)=>{
        const { latitude, longitude } = position.coords;    //extracting the coordinates(coords)
        socket.emit("send-location", {latitude, longitude}) //sending location using coords from frontend to backend
    },
    (error)=>{
        console.error(error); //print the error if occured
    },
    {
        enableHighAccuracy: true,
        timeout: 5000,  //after 5sec it will again check the location and to the server
        maximumAge: 0,  //don't save any previous data >> np caching
    }
    );
}

const map = L.map("map").setView([0,0],16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution: "Priyanshu Choubey",
}).addTo(map);

const markers = {};

socket.on("receive-location",(data)=>{
    const {id,latitude,longitude} = data;
    map.setView([latitude, longitude]);

    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
    map.setView([latitude, longitude]);
});

socket.on("user-disconnected",(id) => {
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }   
});