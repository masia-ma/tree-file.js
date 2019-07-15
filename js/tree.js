var masiaPlugin = (function () {
  function Tree (options) {
    // id = "tree"
    this.rootEle = document.getElementById(options.id);
    this.extendsParentFold = options.extendsParentFold;
    this.clickCb = options.clickCb;
    this.eventProxy()
  }
  Object.assign(Tree.prototype, {
    eventProxy () {
      var self = this;
      this.rootEle.addEventListener('click', function (e) {
        var ele = e.target;
        var childNodes = Array.from(ele.parentElement.children);
        var flag = false;
        if (ele.nodeName == 'SPAN' || ele.nodeName == 'EM') {
          for (var index in childNodes) {
            if (childNodes[index].nodeName == "UL") {
              self.toggle(ele.parentElement.children);
              flag = true; // 真的话，就是有下级
              break;
            }
          }
          if (!flag) { // 如果没有下级
            self.clickCb && self.clickCb(ele);
          }
        }
        if (ele.nodeName == 'I') {
          if (ele.getAttribute('isBothOpen') == "true") { // 打开状态
            ele.setAttribute('isBothOpen', "false");
            var index = Array.from(ele.classList).findIndex(function (classCell) {
              return /^icon-/.test(classCell);
            })
            if (index > 0) {
              ele.classList.remove(ele.classList[index]);
              ele.classList.add('icon-quanbuzhedie');
              // console.log(ele.classList);
            }

            self.bothClose(childNodes);
          } else {
            ele.setAttribute('isBothOpen', "true");
            var index = Array.from(ele.classList).findIndex(function (classCell) {
              return /^icon-/.test(classCell);
            })
            if (index > 0) {
              ele.classList.remove(ele.classList[index]);
              ele.classList.add("icon-quanbuzhankai");
              // console.log(ele.classList);
            }

            self.bothOpen(childNodes);
          }
        }
      }, false);
    },
    
    toggle (childNodes) {
      var ul = Document.findEle('ul', childNodes);
      var em = Document.findEle('em', childNodes);
      var ulActive = Array.from(ul.classList).find(function (classCell) {
        return classCell == 'ulActive';
      }); 
      ulActive ? ul.classList.remove('ulActive') : ul.classList.add('ulActive')
      em.innerText == "+" ? em.innerText = '-' : em.innerText = '+'
    },
    bothClose (childNodes) {
      var self = this;
      if (childNodes.length == 1) return;
      Document.findEle('ul', childNodes).classList.remove('ulActive');
      Document.findEle('em', childNodes).innerText = '+';
      Array.from(Document.findEle('ul', childNodes).children).forEach(function (li) {
        self.bothClose(li.children);
      })
    },
    bothOpen (childNodes) {
      var self = this;
      if (childNodes.length == 1) return;
      Document.findEle('ul', childNodes).classList.add('ulActive');
      Document.findEle('em', childNodes).innerText = '-';
      Array.from(Document.findEle('ul', childNodes).children).forEach(function (li) {
        self.bothOpen(li.children);
      })
    }
  })
  Object.assign(Document, {
    findEle (eleTagName, childNodes) {
      var eleTagName = eleTagName.toUpperCase()
      return Array.from(childNodes).find(function (ele) {
        return ele.nodeName == eleTagName;
      });
    },
  })
  return {
    Tree
  }
})();