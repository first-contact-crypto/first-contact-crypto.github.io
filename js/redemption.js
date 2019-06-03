

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
var assertions = null
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

function getJSONData(sync, url, successfunc, errorfunc) {
  console.log("INFO: In getJSONData")
  $.ajax({
    method: "GET",
    dataType: "json",
    processData: false,
    async: sync,
    contentType: "application/json",
    timeout: 3000,
    url: url,
    success: successfunc,
    error: errorfunc,
    beforeSend: function(xhr) {
                  xhr.setRequestHeader("Authorization", "Bearer " + BADGR_ACCESS_TOKEN)
                }
  })
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
  print("INFO: In getBadgeClasses")
  getJSONData(false, format(BADGR_BASE_URL + BADGR_BADGECLASS_SINGLE_ISSUER_PATH, BADGR_ISSUER_ID), function(data, status, jqXhr) {
    // alert(format("SUCCESS.. got the badgeclasses {0}", JSON.stringify(data)));
    badgeclasses = data;
    print("SUCCESS: In getBadgeClasses.. badgclasses are {0}", JSON.stringify(window.badgeclasses))
  },
  function(jqXhr, textStatus, errorMessage) {
    print("ERROR: In getBadgeClasses.. {0}, {1}", textStatus, errorMessage)
  });
}

function getAssertions() {
    print("INFO: In getAssertions")
    getJSONData(false, format(BADGR_BASE_URL + BADGR_ASSERTION_BADGECLASS_PATH, BADGR_SERVER_SLUG_EPIPHANY), function(data, status, jqXhr) {
    // alert(format("SUCCESS.. got the badgeclasses {0}", JSON.stringify(data)));
    assertions = data;
    // setDevButton("Assertions", "<p>" + JSON.stringify(assertions))
    window.num_epiph_asserts = assertions.result.length
  },
  function(jqXhr, textStatus, errorMessage) {
    print("ERROR: In getAssertions.. {0}, {1}", textStatus, errorMessage);
  });
}



function createBadge(name) {
  var badge_url = format("https://api.badgr.io/v2/issuers/{0}/badgeclasses", BADGR_ISSUER_ID)
  print("INFO: In createBadge.. badge_url is: {0}", badge_url)
  $.ajax({
    method: "POST",
    dataType: "json",
    processData: false,
    contentType: "application/json",
    url: badge_url,
    data: JSON.stringify({"name": name, "description": "An FCC prize category."}),
    success: function(data, status, xhr) {
      print("SUCCESS: In createBadge.. badge created: {0}", JSON.stringify(data))
    },
    error: function(xhr, status, errMsg) { 
      print("ERROR: In createBadge.. badge creation failed! {0} {1}", status, errMsg)
    },
    beforeSend: function(xhr) {
                  xhr.setRequestHeader("Authorization", "Bearer " + BADGR_ACCESS_TOKEN)
                }
  })
}

function createBadges(name_list) {
  print("In createBadges..")
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
      print("SUCCESS: In deleteAssertion.. assertion deleted: {0}", JSON.stringify(data))
    },
    error: function(xhr, status, errMsg) { 
      print("ERROR: In deleteAssertion.. assertion deletion failed! {0} {1}", status, errMsg)
    },
    beforeSend: function(xhr) {xhr.setRequestHeader("Authorization", "Bearer " + BADGR_ACCESS_TOKEN)}
  })
}

function deleteAssertions(num) {
  print("INFO: In deleteAssertions")
  for (i = 0;i<num;i++) {
    deleteAssertion()
  }
}

function createAssertion() {
  print("INFO: In createAssertion.. the selected prize is: {0}", window.selectedPrize)
  var badgeId = getBadgeId(window.selectedPrize);
  var assertion_url = format(BADGR_BASE_URL + BADGR_ASSERTION_BADGECLASS_PATH, badgeId)
  print("INFO: In createAssertion.. the assertion url is: {0}", assertion_url)
  $.ajax({
    method: "POST",
    dataType: "json",
    processData: false,
    contentType: "application/json",
    url: assertion_url,
    // data: JSON.stringify({"name": name, "description": "An FCC prize category."}),
    data: JSON.stringify({"recipient": {"identity": useremail, "type": "email", "hashed": false, "plaintextIdentity": username}}),
    success: function(data, status, xhr) {
      print("SUCCESS: In createAssertion.. assertion created: {0}", JSON.stringify(data))
    },
    error: function(xhr, status, errMsg) { 
      print("ERROR: In createAssertion.. assertion creation failed! {0} {1}", status, errMsg)
    },
    beforeSend: function(xhr) {
                  xhr.setRequestHeader("Authorization", "Bearer " + BADGR_ACCESS_TOKEN)
                }
  })
}

function createPrizeAssertions(ep_spent) {
  print("INFO: In createPrizeAssertion")
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
  print("INFO: In onPlaceBidEvent")
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
  print("INFO: In getPrizeList")
  $(".prize").each(function(index) {
    var txt = convertToSlug($(this).text())
    print("INFO: In getPrizeList.. the prize is: {0}", txt)
    window.prizeList.push(txt)
  });
  
}

function getBadgeClassNamesList() {
  print("INFO: In getBadgeClassNameList.. {0}", window.badgeclasses.result.length)
  for (var i=0;i<window.badgeclasses.result.length;i++) {
    var name = window.badgeclasses.result[i].name 
    // print("{0}", name)
    badgeclassNamesList.push(name)
  }
  print("INFO: bcnl: {0}", badgeclassNamesList.length)
  return badgeclassNamesList
}

function getBadgesToBeCreated() {
  print("INFO: In getBadgesToBeCreated")
  if (window.badgeclasses == null) {
    testBadgesCreated();
  }
  getBadgeClassNamesList()

  plSet = new Set(window.prizeList)
  bcSet = new Set(window.badgeclassNamesList)
  outSet = new Set([...plSet].filter(x => !bcSet.has(x)))
  print("INFO: In getBadgesToBeCreated.. plSet size: {0} .. bcSet size: {1} .. out size: {2}", plSet.size, bcSet.size, outSet.size)
  return Array.from(outSet)
}



async function testBadgesCreated() {
  print("INFO: In testBadgesCreated")
  if (badgeclasses == null) {
    await sleep(500)
    testBadgesCreated()
  }
  else {
    print("SUCCESS: In testBadgesCreated.. badgeclasses list created.. \\o/ {0}", window.badgeclasses.result.length)
  }
}

async function testAssertionsCreated() {
  print("INFO: In testAssertionsCreated")
  if (assertions == null) {
    await sleep(500)
    testAssertionsCreated()
  }
  else {
    print("SUCCESS: In testAssertionsCreated.. assertions list created.. \\0/ {0}", window.badgeclasses.result.length)
  }
}

function getBadgeId(name) {
  var num = badgeclasses.result.length
  print("In getBadgeId.. the num badgeclasses is: {0} .. the name is: {1}", num, name)
  for (var i=0;i<num;i++) {
    var bc = window.badgeclasses.result[i]
    print("In getBadgeId.. the bc.name is: {0} .. the name is: {1}", bc.name, name)
    if (bc.name === name) {
      return bc.entityId
    }
  }
}

getUrlVars()
displayUserInfo()
displaySpendEPText()
getBadgeClasses()
testBadgesCreated()
getAssertions()
testAssertionsCreated()
getPrizeList()
print("INFO: In global_scope.. prizeList: {0}", prizeList.toString())
var new_badges_needed = getBadgesToBeCreated().length;
print("INFO: In global_scope.. new_badges_needed: {0}", new_badges_needed.length);
if (new_badges_needed.length > 0) {createBadges(new_badges_needed)}


