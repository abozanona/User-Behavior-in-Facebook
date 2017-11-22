document.getElementById("_intro").addEventListener("click", _intro);
document.getElementById("_persolaninfo").addEventListener("click", _persolaninfo);
document.getElementById("_profile").addEventListener("click", _profile);
document.getElementById("_settings").addEventListener("click", _settings);
function _intro() {
    setSingleValue("tutorialStepNumber", 1, function () {
        chrome.tabs.create({ url: "https://www.facebook.com" });
    });
}
function _persolaninfo() {
    setSingleValue("tutorialStepNumber", 3, function () {
        getUserID(function (id) {
            chrome.tabs.create({ url: "https://www.facebook.com/profile.php?sk=about&section=overview&pnref=about" });
        });
    });
}
function _profile() {
    setSingleValue("tutorialStepNumber", 5, function () {
        chrome.tabs.create({ url: "https://www.facebook.com/profile.php" });
    });
}
function _settings() {
    setSingleValue("tutorialStepNumber", 8, function () {
        chrome.tabs.create({ url: "https://www.facebook.com/settings" });
    });
}
