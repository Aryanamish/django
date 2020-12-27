import re
import numpy as np

keyword_regex = r'([\'\"].*?[\'\"])|\b((\s)*abstract(\s)*|(\s)*arguments(\s)*|(\s)*await(\s)*|(\s)*boolean(\s)*|(\s)*break(\s)*|(\s)*byte(\s)*|(\s)*case(\s)*|(\s)*catch(\s)*|(\s)*char(\s)*|(\s)*class(\s)*|(\s)*const(\s)*|(\s)*continue(\s)*|(\s)*debugger(\s)*|(\s)*default(\s)*|(\s)*delete(\s)*|(\s)*do(\s)*|(\s)*double(\s)*|(\s)*else(\s)*|(\s)*enum(\s)*|(\s)*eval(\s)*|(\s)*export(\s)*|(\s)*extends(\s)*|(\s)*false(\s)*|(\s)*final(\s)*|(\s)*finally(\s)*|(\s)*float(\s)*|(\s)*for(\s)*|(\s)*function(\s)*|(\s)*goto(\s)*|(\s)*if(\s)*|(\s)*implements(\s)*|(\s)*import(\s)*|(\s)*in(\s)*|(\s)*instanceof(\s)*|(\s)*int(\s)*|(\s)*interface(\s)*|(\s)*let(\s)*|(\s)*long(\s)*|(\s)*native(\s)*|(\s)*new(\s)*|(\s)*null(\s)*|(\s)*package(\s)*|(\s)*private(\s)*|(\s)*protected(\s)*|(\s)*public(\s)*|(\s)*return(\s)*|(\s)*short(\s)*|(\s)*static(\s)*|(\s)*super(\s)*|(\s)*switch(\s)*|(\s)*synchronized(\s)*|(\s)*this(\s)*|(\s)*throw(\s)*|(\s)*throws(\s)*|(\s)*transient(\s)*|(\s)*true(\s)*|(\s)*try(\s)*|(\s)*typeof(\s)*|(\s)*var(\s)*|(\s)*void(\s)*|(\s)*volatile(\s)*|(\s)*while(\s)*|(\s)*with(\s)*|(\s)*yield(\s)*)\b'

text = '''$("#menu-toggle").click(
        function (e) {
            e.preventDefault();
            $('#wr_apper').toggleClass('menuDisplayed');
        }
    );


    $("#prntBtn").click(function(){
        $('.prntHiddenArea').html('');
        $('#prntHiddenArea').html($(".prntArea").html());
        window.print();
});
dsf function
in
$("a").somethin
function allow(sd){
	//dosomething
	/*    dfgdjknds
fsdf */
/*
for i in p{

}
*/
}'''

#  for jquery selector group1 = actual selector eg: #sanfd, .sdfsdg, html
#  		r'\$\([\"\']([#.\w\-_]*)[\"\']\)'
#
#  for selecting keyword in js
#  		'\\b' + keyword_regex + '\\b'
#
#  for comments
#  		(?s)/\*.*?\*/|//[\w\W][^\n\r]*
#
#
#
#  for anything between quotes
#  		['\"].*?['\"]
#
#  for all white space outside quotes
#  		(\s+)(?=(?:[^\'\"]*[\'\"][^\'\"]*[\'\"])*[^\'\"]*$)




regex = re.compile(keyword_regex)

matches = re.finditer(regex, text)
untouch = [[320, 321], [329, 330], [348, 349], [357, 358], [415, 416], [417, 418], [420, 421], [
    2, 16], [94, 105], [119, 134], [162, 172], [202, 219], [226, 228], [241, 258], [267, 278], [335, 338]]

space = []
quote = []
untouched = []


for i in matches:

    if i.group(1) is not None:
        quote.append([i.start(1), i.end(1)])

    for groupNum in range(0, len(i.groups())):
        groupNum = groupNum + 1

        a = i.group(groupNum)

        if a is not None:
            if(i.end(groupNum) - i.start(groupNum) == 1):

                space.append([i.start(groupNum), i.end(groupNum)])
                pass


print(space + quote)

# space = []
# for i in matches:
#     for num in range(0, len(i.groups())):
#         if (i.start(num) != i.end(num)):
#             # space.append([i.start(num), i.end(num)])
#             print('sf')
#
# print(space)
