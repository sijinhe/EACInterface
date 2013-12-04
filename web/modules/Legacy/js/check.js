jQuery.extend({
checkstr: function( str , checkType ){
var result;
switch(checkType){
   case 'odd_number':
    var testStr = testArr['number'];
    var reg = RegExp( testStr,'g' );
    var result = reg.test( str );
    if( true == result ){
    var num = parseInt( str ) % 2;
    if( 1 == num ){
     result = true; 
    }else{
     result = false; 
    }
    }else{
    result = false; 
    }
   break;
   case 'even_number':
    var testStr = testArr['number'];
    var reg = RegExp( testStr,'g' );
    var result = reg.test( str );
    if( true == result ){
    var num=parseInt( str ) % 2;
    if( num == 0 ){
     result = true; 
    }else{
     result = false; 
    }
    }else{
    result = false; 
    }
   break;
   case 'decimal_point':
    var testStr = testArr['positive_float'];
    var reg = RegExp( testStr,'g' );
    var s1=reg.test( str );
    testStr = testArr['negative_float'];
    reg=RegExp( testStr,'g' );
    var s2=reg.test( str );
    if( true == s1 ){
      result = true;
       }else if( true == s2 ){
         result = true;
       }else{
         result = false;;
       }
   break;
   case 'decimal_point_number':
    var testStr = testArr['positive_float'];
    var reg = RegExp( testStr,'g' );
    var s1=reg.test( str );
    testStr = testArr['negative_float'];
    reg=RegExp( testStr,'g' );
    var s2=reg.test( str );
    if( true == s1 ){
      result = true;
       }else if( true == s2 ){
         result = true;
       }else{
         result = false;
       }
    if( true == result ){
    var strArr=str.split('.');
    return strArr[1].length;
    }
   break;
   case 'is_cardid':
    var testStr = testArr['number'];
    var reg = RegExp( testStr,'g' );
       var result = reg.test( str );
    if( true == result ){
    if( 15 == str.length || 18 == str.length ){
     result = true;
    }else{
     result = false; 
    }
    }else{
      result = false;
    }
   break;
   case 'prime_number':
    var strArr = testArr[checkType].split(',');
    var len = strArr.length;
    var result = false;
    var num = parseInt(str);
    for( var i=0; i<len; i++ ){
    if( num == strArr[i] ){
     result=true;
     break;
    }
    }
   break;
   case 'composite_number':
    var strArr = testArr[checkType].split(',');
    var len = strArr.length;
    var result = false;
    var num = parseInt(str);
    for( var i=0;i<len;i++ ){
    if( num == strArr[i] ){
     result=true;
     break;
    } 
    }
   break;
     default:
    var testStr = testArr[checkType];
    var reg = RegExp( testStr,'g' );
       var result = reg.test( str );
   break;
}
return result;
}
});

/*
 * definition
 */
var testArr={};
testArr['positive_int']='^[1-9]\\d*$';
testArr['vmname']='^[a-zA-Z_][a-zA-Z0-9_]*$';
testArr['letter'] = '^[a-zA-Z]+$';
testArr['username'] = '^[0-9a-zA-Z_]+$';
testArr['qq'] = '[0-9]\\d*$';
testArr['email'] = '\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.[a-zA-Z]+([-.][a-zA-Z]+)*';
testArr['ip'] = '\\d+\\.\\d+\\.\\d+\\.\\d+';
testArr['tel'] = '(\\(\\d{3,4}\\)|\\d{3,4}-|\\s)?\\d{7,8}';
testArr['mobile'] = '(86)*0*1[3,5,8]\\d{9}';
//testArr['mobile'] = '[0-9]\\d*$';
testArr['postcode'] = '[1-9]\\d{5}(?!\\d)';
testArr['number'] = '^-?[0-9]\\d*$';
testArr['positive_number'] = '^[1-9]\\d*$';
testArr['negative_number'] = '^-[1-9]\\d*$';
testArr['zh_cn'] = '[\\u4e00-\\u9fa5]';
testArr['prime_number'] = '2,3,5,7,11,13,17,19,23,29,31';
testArr['composite_number'] = '1,4,5,8,9,10,12,14,15,16,18,20,21,22,24,25,26,27,28,30,32,33,34,35';
testArr['positive_float'] = '^[0-9]\\d*\\.\\d*|0\\.\\d*[1-9]\\d*$';
testArr['negative_float'] = '^-([1-9]\\d*\\.\\d*|0\\.\\d*[1-9]\\d*)$';
testArr['is_url'] = '[a-zA-z]+://[^\\s]*';