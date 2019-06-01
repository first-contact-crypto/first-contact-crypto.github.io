import { inherits } from "util";

// TODO: I don't like that I am getting the num_asserts from two different databases.
// FIXME: ^^^^^


const BADGR_ISSUER_ID = "rGy5MNWtQgSs1vfnLyPlmg"
const BADGR_ACCESS_TOKEN = "JCAFLKOLX6k1D28wAIVKfdqqZvQMXC";
const BADGR_COURSE_TYPE = "course"
const BADGR_EPIPHANY_TYPE = "epiphany"
const BADGR_REDEMPTION_TYPE = "redemption"
const BADGR_BASE_URL = "https://api.badgr.io/"
const BADGR_SERVER_SLUG_EPIPHANY = "V_MaSinhQJeKGOtZz6tDAQ"
const BADGR_SERVER_SLUG_REDEMPTION = "XrG4QUcyTQGVch1VipS-Qw"
const DEV_ENV = true

var BADGR_BADGECLASS_SINGLE_ISSUER_PATH = "v2/issuers/{0}/badgeclasses"       // issuer id
var BADGR_ASSERTION_BADGECLASS_PATH = "v2/badgeclasses/{0}/assertions"            // badge_class entityId
var BADGR_ASSERTION_ISSUER_PATH = "v2/issuers/{0}/assertions"
var BADGR_ASSERTION_DELETE_PATH = "v2/assertions{0}"


var recipient = new Object()
recipient.identity = "string"
recipient.type = "email"
recipient.hashed = true
recipient.plaintextIdentity = "string"

var badgeclasses = {}
var assertions = {}

var badgeclasses_txt = ""
var assertions_txt = ""

var prizeList = []


        // EPIPHANY BADGE SERVER SLUG: V_MaSinhQJeKGOtZz6tDAQ
        // IMAGE: https: // media.us.badgr.io / uploads / badges / issuer_badgeclass_efc20af1 - 7d43 - 4d1e - 877e-447244ea3fd3.png

        // COURSE BADGE SERVER SLUG: 2gnNK3RZSlOutOrVeQlD_A
        // IMAGE: https: // media.us.badgr.io / uploads / badges / issuer_badgeclass_63237c1a - 3f3d - 40b7 - 9e48 - 085658d2799f.png

        // REDEMPTION BADGE SERVER SLUG: XrG4QUcyTQGVch1VipS-Qw
        // IMAGE: https: // media.us.badgr.io / uploads / badges / issuer_badgeclass_41b742a0 - d58c - 4223 - bffb - f2bc92fdd4bf.png


// UTITLITIES

function format(fmt, ...args) {
  // retstr = format("blah: {0}", "the_var")
  // https://coderwall.com/p/flonoa/simple-string-format-in-javascript <BOTTOM OF THE PAGE>
  if (!fmt.match(/^(?:(?:(?:[^{}]|(?:\{\{)|(?:\}\}))+)|(?:\{[0-9]+\}))+$/)) {
    throw new Error("invalid format string.")
  }
  return fmt.replace(
    /((?:[^{}]|(?:\{\{)|(?:\}\}))+)|(?:\{([0-9]+)\})/g,
    (m, str, index) => {
      if (str) {
        return str.replace(/(?:{{)|(?:}})/g, m => m[0])
      } else {
        if (index >= args.length) {
          throw new Error("argument index is out of range in format")
        }
        return args[index]
      }
    }
  );
}

function print(fmt, ...args) {
  // Use this for debug statements;
  console.log(format(fmt, ...args))
}

function getJSONData(url, successfunc, errorfunc) {
  // alert(url);
  $.ajax(url, 
  {
    dataType: 'json', // type of response data
    timeout: 3000,     // timeout milliseconds
    // success: function (data,status,xhr) {   // success callback function
    //     $('p').append(data.firstName + ' ' + data.middleName + ' ' + data.lastName);
    // },
    // error: function (jqXhr, textStatus, errorMessage) { // error callback 
    //     $('p').append('Error: ' + errorMessage);
    // }
    success: successfunc,
    error: errorfunc,
    beforeSend: function(xhr) {
                  xhr.setRequestHeader("Authorization", "Bearer " + BADGR_ACCESS_TOKEN)
                }
  });
}

function setDevButton(btnTxt, htmlString) {
  $("#my-container").append("<button id=\"dev-button\">" + btnTxt + "</button>");
  $("#dev-button").click(function() {
    $("#my-container").append(htmlString);
  });
}


function setVarsGlobally(vars) {
  window.username = vars.username
  window.useremail = vars.useremail
  window.epiphany_badgeclass_id = vars.epiphany_badgeclass_id
  window.epiphany_issuer_id = vars.epiphany_issuer_id
  window.num_epiph_asserts = vars.num_epiph_asserts
}


function getURLParameter(parameterName) {
    var result = null,
        tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}

function getUrlVars() {
        // pc_pkg = {
        //   num_epiph_asserts: 0,
        //   num_course_asserts: 0,
        //   epiphany_badgeclass_id: "",
        //   username: "",
        //   useremail: ""
        // };
  var pc_pkg = JSON.parse(getURLParameter("pc_pkg_str"));
  var useremail = ""
  if (DEV_ENV) {
    username = "peteralexander"
    useremail = "peter.alexander@prodatalab.com"
  }
  else {
    useremail = pc_pkg.useremail
    username = pc_pkg.username
  }
  var vars = {
    num_epiph_asserts: Object.keys(assertions).length,
    epiphany_badgeclass_id: BADGR_SERVER_SLUG_EPIPHANY,
    epiphany_issuer_id: "rGy5MNWtQgSs1vfnLyPlmg",
    username: username,
    useremail: useremail
  };
  setVarsGlobally(vars)
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}


function getBadgeClasses() {
  // https://www.w3schools.com/xml/ajax_xmlhttprequest_send.asp
  //   return makeHttpRequest(BADGR_BADGECLASS_SINGLE_ISSUER_PATH, "GET");
  // var xhttp = new XMLHttpRequest();
  // xhttp.onreadystatechange = function() {
  //   if (this.readyState == 4 && this.status == 200) {
  //     badgeclasses_txt = this.responseText
  //     alert(badgeclasses_txt)
  //     badgeclasses = JSON.parse(this.responseText)
      
  //   } else {
  //     print("What the FUCK: In getBadgeClasses.. ERROR")
  //   }
  // };
  // xhttp.open("GET", BADGR_BASE_URL + format(BADGR_BADGECLASS_SINGLE_ISSUER_PATH, "rGy5MNWtQgSs1vfnLyPlmg")+"?t="+Math.random(), true);
  // xhttp.setRequestHeader("Authorization", "Bearer " + BADGR_ACCESS_TOKEN)
  // xhttp.send()
  getJSONData(format(BADGR_BASE_URL + BADGR_BADGECLASS_SINGLE_ISSUER_PATH, BADGR_ISSUER_ID), function(data, status, jqXhr) {
    // alert(format("SUCCESS.. got the badgeclasses {0}", JSON.stringify(data)));
    badgeclasses = data;
    setDevButton("BadgeClasses", "<p>" + JSON.stringify(badgeclasses))

  },
  function(jqXhr, textStatus, errorMessage) {
    // alert("ERROR: In getBadgeClasses.. FAILED get badgeclasses request:: errorMessage: " + errorMessage + "textStatus: " + textStatus)
    setDevButton("BadgeClasses", "<p>" + JSON.stringify("ERROR: In getBadgeClasses.. FAILED get badgeclasses request:: errorMessage: " 
                      + errorMessage + "textStatus: " + textStatus));
  });
}

function getAssertions() {
  console.log("In getAssertions")
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      assertions_txt = this.responseText
      alert(assertions_txt)
      assertions = JSON.parse(this.responseText)

      if (isEmpty(assertions) != false) {
        console.log("SUCCESS from the assertions object parse. here is the entityId: " + assertions.result[0].entityId)
      }
      else {
          console.log("ERROR: In getAssertions.. the assertions object is empty!")
      }
      // document.getElementById("demo").innerHTML = this.responseText;
    //   document.getElementById("demo").innerHTML = window.useremail;
    } else {
      console.log("In getAssertions().. WHAT THE FUCK: " + this.status + " " + this.responseText)
    }
  };
  var params = "recipient=" + window.useremail;
  xhttp.open("GET", BADGR_BASE_URL + format(BADGR_ASSERTION_ISSUER_PATH, BADGR_ISSUER_ID) + "?" + params, true)
  xhttp.setRequestHeader("Authorization", "Bearer " + BADGR_ACCESS_TOKEN)
  xhttp.send()
}

function createAssertion() {
  console.log("In createAssertion")

}

function createBadge(name) {
  var badge_url = format("https://api.badgr.io/v2/issuers/{0}/badgeclasses", BADGR_ISSUER_ID)
  $.ajax({
    method: "POST",
    dataType: "json",
    url: badge_url,
    data: JSON.stringify({"name": name, "description": "An FCC prize category."}),
    success: function(result) {
      print("In createBadge.. SUCCESS, badge created")
    },
    failure: function(errMsg) {
      print("In createBadge.. ERROR: {0}", errMsg)
    }
  })
}

function createBadges(name_list) {
  for (i=0;i<name_list.length;i++) {
    createBadge(name_list[i])
  }
}

function displayUserInfo() {
  // document.getElementById("demo").innerHTML = window.username + ";" + window.useremail + ";" + window.epiphany_issuer_id + ";" + window.epiphany_badgeclass_id;
  document.getElementById("introductory-text").innerHTML = "Congratulations " + window.username + " You currently have " + window.num_epiph_asserts + " Epiphany Points to spend.";
}

function displaySpendEPText() {
  // alert("In displaySpendEPText()");
  document.getElementById("spend-ep-text").innerHTML = "You currently have " + window.num_epiph_asserts + " epiphany points to spend. Each EP represents one chance to win. The more you spend the more chances you have to win!";
  document.getElementById("num-spent-input").setAttribute("max", window.num_epiph_asserts);
}

function deleteAssertion(num) {
  console.log("In deleteAssertions()")
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
      if (this.readyState == "complete" && this.status == 204) {
        var old = window.num_epiph_asserts;
        --window.num_epiph_asserts;
        alert("The number of assertions was " + old + " and now is " + window.num_epiph_asserts);
      } else {
        console.log("In deleteAssertions.. WHAT THE FUCK: In deleteAssertions.. " + this.status + " " + this.responseText);
      }
    };

    xhttp.open("DELETE", BADGR_BASE_URL + format(BADGR_ASSERTION_DELETE_PATH, assertions[0].entityId));
    xhttp.setRequestHeader("Authorization", "Bearer " + BADGR_ACCESS_TOKEN);
    xhttp.send();
}

function deleteAssertions(num) {
  for (i = 0;i<num;i++) {
    deleteAssertion()
  }
}

// function createPrizeAssertions(ep_spent) {
//   for (var i=0;i<ep_spent;)
// }

function onPlaceBidEvent() {
  ep_saved = window.num_epiph_asserts
  ep_spent = document.getElementById("num-spent-input").value
  ep_left = ep_saved - ep_spent
  createPrizeAssertions(ep_spent)
  deleteAssertions(ep_spent)
  return true
}

function convertToSlug(Text) {
  return Text.toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}

function getPrizeList() {
  $(".prize").each(function(index) {
    prizeList.push(convertToSlug(this.text()))
  })
}

function getBadgesToBeCreated() {
  ret = prizeList
  for (i=0;i<badgeclasses.length;i++) {
    bc = badgeclasses[i]
    bc_name = bc.name 
    for (j=0;j<prizeList.length;j++) {
      pl_name = prizelist[j]
      if (bc_name === pl_name) {
        ret.splice(j,1)
      }
    }
  }
  return ret
}



getUrlVars()
displayUserInfo()
displaySpendEPText()
getBadgeClasses()
// getAssertions()
// getPrizeList()
// new_badges_needed = getBadgesToBeCreated()
// createBadges(new_badges_needed)
