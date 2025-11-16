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

    document.getElementById("challenge").innerHTML = `Change the <span class="attribute">${random_attribute.text}</span> of the <span class="selector">${random_element.text}</span> to <span class="value">${random_value}</span>`;
    
    let styleElement = document.getElementById("outcomeStyles") || document.createElement("style");
    styleElement.id = "outcomeStyles";
    styleElement.textContent = `#expectedOutcome ${random_element.selector}{${random_attribute.attr}:${random_value}}`;
    document.head.appendChild(styleElement);
}
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

function applySafeCSS() {
    const userCSS = document.getElementById("cssInput").value;

    // Only allow specific safe properties:
    const allowedProps = ["color", "background-color", 
                            "font-size", "font-style", "font-family","font-weight",
                            "text-align","text-shadow","text-decoration",
                            "border", "box-shadow"];

    // Split rules into lines
    let filtered = userCSS.replace(/([^{}]+)\{([^}]+)\}/g, (match, selector, rules) => {
        const safeRules = rules.split(";").filter(rule => {
            const property = rule.split(":")[0].trim().toLowerCase();
            return allowedProps.includes(property);
        }).join("; ");

        return `#userOutcome ${selector}{${safeRules}}`;
    });

    let styleElement = document.getElementById("userStyles") || document.createElement("style");
    styleElement.id = "userStyles";
    styleElement.textContent = filtered;
    document.head.appendChild(styleElement);
}
