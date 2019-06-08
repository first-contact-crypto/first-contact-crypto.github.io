// Set the date we're counting down to
var keepkeyCountDownDate = new Date("June 16, 2019 23:59:59").getTime()
var bitcoin5CountDownDate = new Date("June 16, 2019 23:59:59").getTime()
var amazon5CountDownDate = new Date("June 16, 2019 23:59:59").getTime()

// Update the count down every 1 second
function mySetInterval(countDownDate) {
    var x = setInterval(function() {
    // Get today's date and time
        var now = new Date().getTime()

        // Find the distance between now and the count down date
        var distance = countDownDate - now

        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24))
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        var seconds = Math.floor((distance % (1000 * 60)) / 1000)

        // Display the result in the element with id="demo"
        document.getElementById("countdown-timer-keepkey").innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s "
        document.getElementById("countdown-timer-bitcoin5").innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s "
        document.getElementById("countdown-timer-amazon5").innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s "
        // If the count down is finished, write some text
        if (distance < 0) {
            clearInterval(x)
            // eslint-disable-next-line indent
            document.getElementById("countdown-timer-keepkey").innerHTML = "EXPIRED"
            document.getElementById("countdown-timer-bitcoin5").innerHTML = "EXPIRED"
            document.getElementById("countdown-timer-amazon5").innerHTML = "EXPIRED"
        }
    }, 1000)
}


mySetInterval()
// mySetInterval("countdown-timer-bitcoin5",bitcoin5CountDownDate)
// mySetInterval("countdown-timer-amazon5", amazon5CountDownDate)