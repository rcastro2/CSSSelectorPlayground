let rnd = (l,u) => Math.floor(Math.random() * (u-l) + l);
const colors = ["red", "blue", "green", "yellow", "cyan","magenta", "pink", "orange"];
const attributes = [{attr:"color",
                     text:"color",
                     value(){
                        return colors[rnd(0,colors.length)];
                     }},
                     {attr:"background-color",
                      text:"background color",
                      value(){
                        return colors[rnd(0,colors.length)];
                      }},
                      {attr:"font-size",
                       text:"size of the text ",
                       value(){
                        return `${8 + rnd(0,8)}pt`;
                      }},
                      {attr:"font-style",
                       text:"style of the text ",
                       value(){
                        return `normal`;
                      }},
                      {attr:"font-family",
                       text:"type of the font ",
                       value(){
                         families = ["Comic Sans MS","Arial","Courier New","Brush Script MT"]
                         return families[rnd(0,families.length)];
                      }},
                      {attr:"font-weight",
                       text:"weight of the font ",
                       value(){
                        return `bold`;
                      }},
                      {attr:"text-align",
                       text: "alignment of the text ",
                       value(){
                         alignments = ["left","right","center"]
                         return alignments[rnd(0,alignments.length)];
                      }},
                      {attr:"text-decoration",
                       text: "decortation on the text ",
                       value(){
                         decorations = ["underline","overline","line-through"]
                         return decorations[rnd(0,decorations.length)];
                      }},
                      {attr:"text-shadow",
                       text: "shadow on the text ",
                       value(){
                         return `${colors[rnd(0,colors.length)]} ${rnd(1,3)}px ${rnd(1,3)}px`;
                      }},
                      {attr:"box-shadow",
                       text: "shadow around the edge ",
                       value(){
                         return `${colors[rnd(0,colors.length)]} ${rnd(1,3)}px ${rnd(1,3)}px`;
                      }},
                      {attr:"border",
                       text: "border ",
                       value(){
                         line = ["dotted ","dashed","solid","double"]
                         return `${colors[rnd(0,colors.length)]} ${line[rnd(0,line.length)]} ${rnd(1,3)}px`;
                      }}
                    ]
const elements = [{text: "paragraph",selector:"p"},
                  {text: "heading with a size 3",selector:"h3"},
                  {text: "div container",selector:"div"},
                  {text: "span container",selector:"span"},
                  {text: "items in the list",selector:"li"},

]
const highlightCSS = `.selector{
    background-color:yellow;
}
.attribute{
    background-color:cyan;
}
.value{
    background-color:magenta;
}`
function toggleHighlights(){
    console.log(document.getElementById("highlight").checked)
    if(document.getElementById("highlight").checked){
        document.getElementById("highlightOptions").style.visibility = "visible";
        let styleElement = document.getElementById("highlightStyles") || document.createElement("style");
        styleElement.id = "highlightStyles";
        styleElement.textContent = highlightCSS;
        document.head.appendChild(styleElement);
    }else{
        document.getElementById("highlightOptions").style.visibility = "hidden";
        document.getElementById("highlightStyles").innerHTML = "";
    }
}
let currentChallenge = {
    selector: null,
    property: null,
    value: null
};
function generateRule(){
    if(document.getElementById("userStyles")){
        document.getElementById("userStyles").innerHTML = "";
    }
    if(document.getElementById("outcomeStyles")){
        document.getElementById("outcomeStyles").innerHTML = "";
        
    }
    document.getElementById("cssInput").value = "";
    let random_element = elements[rnd(0,elements.length)];
    let random_attribute = attributes[rnd(0,attributes.length)];
    let random_value = random_attribute.value();
    currentChallenge.selector = random_element.selector;
    currentChallenge.property = random_attribute.attr;
    currentChallenge.value = random_value;


    document.getElementById("challenge").innerHTML = `Change the <span class="attribute">${random_attribute.text}</span> of the <span class="selector">${random_element.text}</span> to <span class="value">${random_value}</span>`;
    
    let styleElement = document.getElementById("outcomeStyles") || document.createElement("style");
    styleElement.id = "outcomeStyles";
    styleElement.textContent = `#expectedOutcome ${random_element.selector}{${random_attribute.attr}:${random_value}}`;
    document.head.appendChild(styleElement);
}

function showFeedback(msg, ok = false) {
  let fb = document.getElementById("feedback");
  if (!fb) {
    fb = document.createElement("div");
    fb.id = "feedback";
    fb.style.marginTop = "8px";
    document.getElementById("response").appendChild(fb);
  }
  fb.innerHTML = msg;
  fb.style.color = ok ? "green" : "crimson";
}

// improved, whitespace-tolerant applySafeCSS
function applySafeCSS() {
  const userCSS = document.getElementById("cssInput").value || "";

  const allowedProps = ["color", "background-color",
    "font-size", "font-style", "font-family", "font-weight",
    "text-align", "text-shadow", "text-decoration",
    "border", "box-shadow"];

  // tolerant rule matcher: match ANY characters up to a {, then everything up to the matching }
  // This will capture rules whether or not there's a space between selector and {
  const rulePattern = /([^{]+)\{([^}]*)\}/g;
  let match;
  let outputRules = [];

  while ((match = rulePattern.exec(userCSS)) !== null) {
    let rawSelector = match[1].trim();
    let rawDecls = match[2].trim();

    if (!rawSelector || !rawDecls) continue;

    // split declarations by semicolon; tolerate extra spaces and missing trailing semicolon
    const declParts = rawDecls.split(";").map(d => d.trim()).filter(Boolean);
    const safeDecls = [];

    for (const decl of declParts) {
      // require a colon; ignore malformed declarations
      const colonIndex = decl.indexOf(":");
      if (colonIndex === -1) continue;

      let prop = decl.slice(0, colonIndex).trim().toLowerCase();
      let val = decl.slice(colonIndex + 1).trim();

      // normalize whitespace inside the value (e.g. multiple spaces -> single)
      val = val.replace(/\s+/g, " ");

      if (!allowedProps.includes(prop)) {
        // skip disallowed properties
        continue;
      }

      // reconstruct canonical form: "prop: value;"
      safeDecls.push(`${prop}: ${val};`);
    }

    if (safeDecls.length) {
      // keep selector exactly as user wrote (trimmed) so selectors like ".info > span" are preserved
      outputRules.push(`#userOutcome ${rawSelector} { ${safeDecls.join(" ")} }`);
    }
  }

  if (outputRules.length === 0) {
    const feedbackBox = document.getElementById("feedback");
    feedbackBox.style.color = "red";
    feedbackBox.innerHTML = "&#10060; No valid CSS rules found. Check your braces, colons and semicolons.";

    // remove any previous userStyles so old styles don't linger
    const prev = document.getElementById("userStyles");
    if (prev) prev.textContent = "";
    return;
  }

  const resultCSS = outputRules.join("\n");

  // apply to page
  let styleElement = document.getElementById("userStyles");
  if (!styleElement) {
    styleElement = document.createElement("style");
    styleElement.id = "userStyles";
    document.head.appendChild(styleElement);
  }
  styleElement.textContent = resultCSS;
  checkUserAnswer();
}


function checkUserAnswer() {
    const expectedEl = document.querySelector(`#expectedOutcome ${currentChallenge.selector}`);
    const userEl     = document.querySelector(`#userOutcome ${currentChallenge.selector}`);

    if (!expectedEl || !userEl) return;

    const expectedStyle = window.getComputedStyle(expectedEl)[currentChallenge.property];
    const userStyle     = window.getComputedStyle(userEl)[currentChallenge.property];

    const feedbackBox = document.getElementById("feedback");

    if (expectedStyle === userStyle) {
        feedbackBox.style.color = "green";
        feedbackBox.innerHTML = "&#9989; Correct! Your CSS matches the expected rule.";
    } else {
        feedbackBox.style.color = "red";
        feedbackBox.innerHTML = `&#10060; Not quite. Expected "${expectedStyle}", but got "${userStyle}".`;
    }
}
