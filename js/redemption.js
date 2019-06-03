

const DEV_ENV = false;

// {
//   "badgr_access_token": "eQYBJeoj8MD5CNNGiW9lbhmrqoGYTz",
//   "badgr_refresh_token": "ScStrEeMla8gfXfR70Xxmm0sEW1zRY"
// }

const BADGR_ISSUER_ID = "rGy5MNWtQgSs1vfnLyPlmg"
const BADGR_ACCESS_TOKEN = "8sIZ0Il1gnBcrgl4HxYZRG5EGu6Ecj";
const BADGR_COURSE_TYPE = "course"
const BADGR_EPIPHANY_TYPE = "epiphany"
const BADGR_REDEMPTION_TYPE = "redemption"
const BADGR_BASE_URL = "https://api.badgr.io/"
const BADGR_SERVER_SLUG_EPIPHANY = "V_MaSinhQJeKGOtZz6tDAQ"
const BADGR_SERVER_SLUG_REDEMPTION = "XrG4QUcyTQGVch1VipS-Qw"

var BADGR_BADGECLASS_SINGLE_ISSUER_PATH = "v2/issuers/{0}/badgeclasses"       // issuer id
var BADGR_ASSERTION_BADGECLASS_PATH = "v2/badgeclasses/{0}/assertions"            // badge_class entityId
var BADGR_ASSERTION_ISSUER_PATH = "v2/issuers/{0}/assertions"
var BADGR_ASSERTION_DELETE_PATH = "v2/assertions/{0}"


// https://api.badgr.io/v2/badgeclasses/V_MaSinhQJeKGOtZz6tDAQ/assertions

var recipient = new Object();
recipient.identity = "string"
recipient.type = "email"
recipient.hashed = true
recipient.plaintextIdentity = "string"

var badgeclasses = null
var assertions = {}
var badgeclasses_txt = ""
var assertions_txt = ""
var prizeList = []
var badgeclassNamesList = []
var selectedPrize = ""


        // EPIPHANY BADGE SERVER SLUG: V_MaSinhQJeKGOtZz6tDAQ
        // IMAGE: https: // media.us.badgr.io / uploads / badges / issuer_badgeclass_efc20af1 - 7d43 - 4d1e - 877e-447244ea3fd3.png

        // COURSE BADGE SERVER SLUG: 2gnNK3RZSlOutOrVeQlD_A
        // IMAGE: https: // media.us.badgr.io / uploads / badges / issuer_badgeclass_63237c1a - 3f3d - 40b7 - 9e48 - 085658d2799f.png

        // REDEMPTION BADGE SERVER SLUG: XrG4QUcyTQGVch1VipS-Qw
        // IMAGE: https: // media.us.badgr.io / uploads / badges / issuer_badgeclass_41b742a0 - d58c - 4223 - bffb - f2bc92fdd4bf.png


// UTITLITIES

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


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

function getJSONData(url, sync, successfunc, errorfunc) {
  print("In getJSONData")
  $.ajax({
    method: "GET",
    dataType: "json",
    processData: false,
    async: sync,
    contentType: "application/json",
    timeout: 3000,
    url: url,
    // data: JSON.stringify({"name": name, "description": "An FCC prize category."}),
    // data: JSON.stringify({"recipient": {"identity": useremail, "type": "email", "hashed": false, "plaintextIdentity": username}}),
    success: successfunc,
    error: errorfunc,
    beforeSend: function(xhr) {
                  xhr.setRequestHeader("Authorization", "Bearer " + BADGR_ACCESS_TOKEN)
                }
  })
}

// function setDevButton(btnId, divId, htmlString) {
//   // $("#my-container").append("<button id=\"" + btnId + "\">" + btnTxt + "</button>");
//   // $("#"+btnId).click(function() {
//   //   $("#my-container").append(htmlString);
//   // });
//   $("#"+divId).show();
//   $(".show_hide").show();
//   $('.show_hide').click(function(){
//     $(".spread").toggle();
// }


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
    // num_epiph_asserts: Object.keys(assertions).length,
    num_epiph_asserts: pc_pkg.num_epiph_asserts,
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
  print("In getBadgeClasses")
  getJSONData(format(BADGR_BASE_URL + BADGR_BADGECLASS_SINGLE_ISSUER_PATH, BADGR_ISSUER_ID), function(data, status, jqXhr) {
    // alert(format("SUCCESS.. got the badgeclasses {0}", JSON.stringify(data)));
    badgeclasses = data;
    print("In getBadgeClasses.. badgclasses are {0}", JSON.stringify(window.badgeclasses))
  },
  function(jqXhr, textStatus, errorMessage) {
    print("ERROR: {0}, {1}", textStatus, errorMessage)
  });
}

function getAssertions() {
  // console.log("In getAssertions")
    getJSONData(format(BADGR_BASE_URL + BADGR_ASSERTION_BADGECLASS_PATH, BADGR_SERVER_SLUG_EPIPHANY), function(data, status, jqXhr) {
    // alert(format("SUCCESS.. got the badgeclasses {0}", JSON.stringify(data)));
    assertions = data;
    // setDevButton("Assertions", "<p>" + JSON.stringify(assertions))
    window.num_epiph_asserts = assertions.result.length
  },
  function(jqXhr, textStatus, errorMessage) {
    // alert("ERROR: In getBadgeClasses.. FAILED get badgeclasses request:: errorMessage: " + errorMessage + "textStatus: " + textStatus)
    // setDevButton("BadgeClasses", "<h4>Assertions</h4><p>" + JSON.stringify("ERROR: In getBadgeClasses.. FAILED get badgeclasses request:: errorMessage: " 
                      // + errorMessage + "textStatus: " + textStatus));
  });
  // var xhttp = new XMLHttpRequest();
  // xhttp.onreadystatechange = function() {
  //   if (this.readyState == 4 && this.status == 200) {
  //     assertions_txt = this.responseText
  //     alert(assertions_txt)
  //     assertions = JSON.parse(this.responseText)

  //     if (isEmpty(assertions) != false) {
  //       console.log("SUCCESS from the assertions object parse. here is the entityId: " + assertions.result[0].entityId)
  //     }
  //     else {
  //         console.log("ERROR: In getAssertions.. the assertions object is empty!")
  //     }
  //     // document.getElementById("demo").innerHTML = this.responseText;
  //   //   document.getElementById("demo").innerHTML = window.useremail;
  //   } else {
  //     console.log("In getAssertions().. WHAT THE FUCK: " + this.status + " " + this.responseText)
  //   }
  // };
  // var params = "recipient=" + window.useremail;
  // xhttp.open("GET", BADGR_BASE_URL + format(BADGR_ASSERTION_ISSUER_PATH, BADGR_ISSUER_ID) + "?" + params, true)
  // xhttp.setRequestHeader("Authorization", "Bearer " + BADGR_ACCESS_TOKEN)
  // xhttp.send()
}



function createBadge(name) {
  var badge_url = format("https://api.badgr.io/v2/issuers/{0}/badgeclasses", BADGR_ISSUER_ID)
  console.log
  $.ajax({
    method: "POST",
    dataType: "json",
    processData: false,
    contentType: "application/json",
    url: badge_url,
    data: JSON.stringify({"name": name, "description": "An FCC prize category."}),
    success: function(data, status, xhr) {
      print("In createBadge.. badge created: {0}", JSON.stringify(data))
    },
    error: function(xhr, status, errMsg) { 
      print("In createBadge.. badge creation failed! {0} {1}", status, errMsg)
    },
    beforeSend: function(xhr) {
                  xhr.setRequestHeader("Authorization", "Bearer " + BADGR_ACCESS_TOKEN)
                }
  })
}

function createBadges(name_list) {
  for (i=0;i<name_list.length;i++) {
    createBadge(name_list[i])
  }
  // createBadge(name_list[0])
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
  ("In deleteAssertion")
  var badgeId = getBadgeId(selectedPrize);
  // var badge_url = format("https://api.badgr.io/v2/issuers/{0}/badgeclasses", BADGR_ISSUER_ID)
  var assertion_url = format(BADGR_BASE_URL + BADGR_ASSERTION_DELETE_PATH, badgeId)
  
  $.ajax({
    method: "DELETE",
    dataType: "json",
    processData: false,
    contentType: "application/json",
    url: assertion_url,
    // data: JSON.stringify({"name": name, "description": "An FCC prize category."}),
    // data: JSON.stringify({"recipient": {"identity": useremail, "type": "email", "hashed": false, "plaintextIdentity": username}}),
    success: function(data, status, xhr) {
      print("In deleteAssertion.. assertion deleted: {0}", JSON.stringify(data))
    },
    error: function(xhr, status, errMsg) { 
      print("In deleteAssertion.. assertion deletion failed! {0} {1}", status, errMsg)
    },
    beforeSend: function(xhr) {xhr.setRequestHeader("Authorization", "Bearer " + BADGR_ACCESS_TOKEN)}
  })
}

function deleteAssertions(num) {
  print("In deleteAssertions")
  for (i = 0;i<num;i++) {
    deleteAssertion()
  }
}

function createAssertion() {
  print("In createAssertion")
  var badgeId = getBadgeId(selectedPrize);
  // var badge_url = format("https://api.badgr.io/v2/issuers/{0}/badgeclasses", BADGR_ISSUER_ID)
  var assertion_url = format(BADGR_BASE_URL + BADGR_ASSERTION_BADGECLASS_PATH, badgeId)
  print("In createAssertion.. the assertion url is: {0}", assertion_url)
  $.ajax({
    method: "POST",
    dataType: "json",
    processData: false,
    contentType: "application/json",
    url: badge_url,
    // data: JSON.stringify({"name": name, "description": "An FCC prize category."}),
    data: JSON.stringify({"recipient": {"identity": useremail, "type": "email", "hashed": false, "plaintextIdentity": username}}),
    success: function(data, status, xhr) {
      print("In createAssertion.. assertion created: {0}", JSON.stringify(data))
    },
    error: function(xhr, status, errMsg) { 
      print("In createAssertion.. assertion creation failed! {0} {1}", status, errMsg)
    },
    beforeSend: function(xhr) {
                  xhr.setRequestHeader("Authorization", "Bearer " + BADGR_ACCESS_TOKEN)
                }
  })
}

function createPrizeAssertions(ep_spent) {
  print("In createPrizeAssertion")
  for (var i=0;i<ep_spent;i++) {
    createAssertion()
  }
}

function onSelectPrizeEvent(title) {
  selectedPrize = convertToSlug(title)
  $("#placeBidModal").modal()
}

function onPlaceBidEvent() {
  ep_spent = document.getElementById("num-spent-input").value;
  if (ep_spent == 0) {
    return true;
  }
  print("In onPlaceBidEvent")
  $("#welcome-title").text("Good job cryptonaut and good luck!")
  $("#introductory-text").text("You now are entered to win, an email will be sent you confirming your bid.")
  var msg = "Now you can continue to bid on another prize or go on back to the control center."
  $("#welcome-body").text(msg)
  $("#welcome-body").after('<br/><a href="https://learn.firstcontactcrypto.com/dashboard" type="button" class="btn btn-primary">Control Center</a>')
  ep_saved = window.num_epiph_asserts

  ep_left = ep_saved - ep_spent
  createPrizeAssertions(ep_spent)
  deleteAssertions(ep_spent)
  return true
}



function convertToSlug(text) {
  return text.toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}

function getPrizeList() {
  console.log("In getPrizeList")
  $(".prize").each(function(index, element) {
    prizeList.push(convertToSlug($(this).text()))
  });
  
}

function getBadgeClassNamesList() {
  print("In getBadgeClassNameList.. {0}", window.badgeclasses.result.length)
  for (var i=0;i<window.badgeclasses.result.length;i++) {
    var name = window.badgeclasses.result[i].name 
    // print("{0}", name)
    badgeclassNamesList.push(name)
  }
  print("bcnl: {0}", badgeclassNamesList.length)
  return badgeclassNamesList
}

function getBadgesToBeCreated() {
  print("Here I am")
  getBadgeClassNamesList()
  plSet = new Set(prizeList)
  bcSet = new Set(badgeclassNamesList)
  outSet = new Set([...plSet].filter(x => !bcSet.has(x)))
  print("size 1: {0} .. size 2: {1} .. size 3: {2}", plSet.size, bcSet.size, outSet.size)
  return Array.from(outSet)
}



async function testBadgesCreated() {
  if (badgeclasses == null) {
    await sleep(500)
    testBadgesCreated()
  }
  else {
    print("In testBadgesCreated.. badgeclasses created.. \\0/ {0}", window.badgeclasses.result.length)
  }
}

function getBadgeId(name) {
  for (var i=0;i<window.badgeclasses.result.length;i++) {
    var bc = badgeclassess.result[i]
    if (bc.name === name) {
      return bc.entityId
    }
  }
}

getUrlVars()
displayUserInfo()
displaySpendEPText()
getBadgeClasses()
getAssertions()
getPrizeList()
console.log("prizeList: " + prizeList.toString())
// testBadgesCreated()
var new_badges_needed = getBadgesToBeCreated()
console.log("new_badges_needed: " + JSON.stringify(new_badges_needed))
createBadges(new_badges_needed)

