/* eslint-disable no-console */
/* eslint-disable indent */

// https://dev.to/johnpaulada/synchronous-fetch-with-asyncawait

async function sleep(ms) {
  let promise = new Promise(resolve => setTimeout(resolve, ms));
  let result = await promise
  // return result 
} 

function format(fmt, ...args) {
  // retstr = format("blah: {0}", "the_var")
  // https://coderwall.com/p/flonoa/simple-string-format-in-javascript <BOTTOM OF THE PAGE>
  if (!fmt.match(/^(?:(?:(?:[^{}]|(?:\{\{)|(?:\}\}))+)|(?:\{[0-9]+\}))+$/)) {
    throw new Error("invalid format string.");
  }
  return fmt.replace(
    /((?:[^{}]|(?:\{\{)|(?:\}\}))+)|(?:\{([0-9]+)\})/g,
    (m, str, index) => {
      if (str) {
        return str.replace(/(?:{{)|(?:}})/g, m => m[0]);
      } else {
        if (index >= args.length) {
          throw new Error("argument index is out of range in format");
        }
        return args[index];
      }
    }
  );
}

function PRINT(fmt, ...args) {
  // Use this for debug statements;
  console.log(format(fmt, ...args));
}


// const DEV_ENV = false;

const BADGR_ACCESS_TOKEN = ""
const AUTHORIZATION_HEADER = "Authorization: Bearer " + BADGR_ACCESS_TOKEN
const BADGR_GET_ASSERTIONS_URL = "https://api.badgr.io/v2/badgeclasses/{0}/assertions"


var init = {method: "POST", mode: "cors", cache: "no-cache", credentials: "same-origin", 
  headers: {
    Authorization: AUTHORIZATION_HEADER,
    ContentType: "application/javascript"
  },
  redirect: "follow",
  referrer: "no-referrer",
  // eslint-disable-next-line no-undef
  body: JSON.stringify(data)
}

function getAssertions() {}
fetch(BADGR_GET_ASSERTIONS_URL)
  .then(function(response) {
    return response.json()
  }) 
  .then(function(myJSON) {
    PRINT(JSON.stringify(myJSON))
  })
  .then(response => response.json(data))
}