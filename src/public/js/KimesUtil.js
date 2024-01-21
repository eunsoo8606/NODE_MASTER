/**
 * 프로그램명 : 공통 유틸리티 자바스크립트 클래스
 * 작  성  자 : 김은수
 * 작  성  일 : 2021.03.30
 * 설      명 : 사용자정의 객체클래스 방식 스크립트
 * 이      력 :
 */

/*******************************************************************************
 클래스명 : 일반 유틸리티 클래스
 설    명 : 가장 많이 쓰이는 일반적인 함수
*******************************************************************************/
var Util = new Util();

function Util() {
	
	   /*
	    * 브라우저 쿠키 저장
	    * @param 저장할 쿠키 이름 , 저장할 값, 보관할 일시
	    * @return 
	    */
	this.setCookie = function(cookieName, value, exdays){
	    var exdate = new Date();
	    exdate.setDate(exdate.getDate() + exdays);
	    var cookieValue = escape(value) + ((exdays==null) ? "" : "; expires=" + exdate.toGMTString());
	    document.cookie = cookieName + "=" + cookieValue;
	}
	 /*
	    * 브라우저 쿠키 삭제
	    * @param 삭제할 쿠키 이름 
	    * @return 
	    */
	this.deleteCookie = function(cookieName){
	    var expireDate = new Date();
	    expireDate.setDate(expireDate.getDate() - 1);
	    document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString();
	}
	 /*
	    * 브라우저 쿠기 가져오기
	    * @param 가져올 쿠키 이름
	    * @return 
	    */
	this.getCookie = function(cookieName) {
        console.log("getCooke init...")
	    cookieName = cookieName + '=';
	    var cookieData = document.cookie;
	    var start = cookieData.indexOf(cookieName);
	    var cookieValue = '';
	    if(start != -1){
	        start += cookieName.length;
	        var end = cookieData.indexOf(';', start);
	        if(end == -1)end = cookieData.length;
	        cookieValue = cookieData.substring(start, end);
	    }
	    return unescape(cookieValue);
	}
	
	/**
     * Null 검사 및 앞뒤공백 제거한 문자열 가져오기.
     * @param arg1 배열 혹은 값
     * @param arg2 key 혹은 기본값
     * @param arg3 기본값
     */
    this.get = function(arg1, arg2, arg3) {
	    var flowName = this.className+".get() ";
	    try {
	        if(arguments.length == 1) {
	            var str = new String(arg1);
                if(str == "NaN") return "";
                else if(str == null) return "";
                else if(str == undefined) return "";
                else if(str.length == 0) return "";
                else if(str == "undefined") return "";
                else if(str == "null") return "";
                else if(str == "NULL") return "";
                else if(str == "(null)") return "";
                else if(str == "(NULL)") return "";
                else if(str == "{null}") return "";
                else if(str == "{NULL}") return "";
                else return str;
	        } else if(arguments.length == 2) {
	            if(typeof arg1 == "string") {
	                return Util.isNull(arg1) ? this.get(arg2) : this.get(arg1);
	            } else if(typeof arg1 == "object" && arg1 instanceof Array) {
	                return this.get(arg1[arg2]);
	            } else {
	               return "";
                }
	        } else if(arguments.length == 3) {
	            if(typeof arg1 == "object" && arg1 instanceof Array) {
    	            var str = this.get(arg1[arg2]);
    	            return Util.isNull(str) ? this.get(arg3) : this.get(str);
	            } else {
	               return "";
                }
	        }
        } catch(e) {
            e.message = flowName+e.message;
            throw e;
        }
    }
    
    /**
     * yyyymmdd 문자열 포맷 변경 함수
     * @param 변경할 date
     * @param 변경할 포맷 {-,.,*,/}등등
     * @return yyyy{변경할 포맷}mm{변경할 포맷}dd
     */
    this.dateFormat = function(value,format) {
        var year = res.substr(0,4);
        var month = res.substr(4,2);
        var day = res.substr(6,2);
        return year + format + month + format + day;
    }
    
    /**
     * 특수문자 사용여부 체크 함수
     * @param 체크할 값
     * @return boolean
     */
    this.checkInput =  function(value) {
        // 특수문자 사용 체크
        var pattern = /[~!@#$%^&*()_+|<>?:{}]/;
        return pattern.test(value) ? true : false;
    }
    
    /**
     * 휴대폰 번호 체크하여 알맞게 출력
     * @param 체크할 값,(true 면 inputId와 같이 해당 인풋박스에 값 넣어줌)or(false 면 ***-***-**** 해당문자열 포맷으로 리턴)
     * @return 포맷된 값
     */
    function cellNumberCheck(value,boolean,inputId1,inputId2,inputId3) {
        var phone = Util.get(value);
        
        var phoneArr =[];
        phoneArr.push('031','032','033','041','043','042','044','051','052','053','054','055','061','062','063','064','070'
            ,'010','011','017','019');
        var firstNb1 = phone.substr(0,2);
        var firstNb2 = phone.substr(0,3);
        var firstNb3 = phone.substr(0,4);
        var firstNumCheck = true;
        var lastNb = phone.substr(phone.length -4,4);

        //앞자리가 두자리라면..
        if(firstNb1 == "02"){
            var secNb = "";
            if((phone.length-firstNb1) == 7)
            secNb = phone.substr(firstNb1.length,lastNb.length-1);
            if((phone.length-firstNb1) == 8)
                secNb = phone.substr(firstNb1.length,lastNb.length);
            
            if(boolean){
            $("#" + inputId1).val(firstNb1);
            $("#" + inputId2).val(secNb);
            $("#" + inputId3).val(lastNb);
            }else return firstNb1 + "-" + secNb + "-" + lastNb;
        }else{
            //앞자리가 3자리인지 체크하는데 지역번호로 체크
        	 for(var i = 0; i < phoneArr.length; i++){
                 //앞자리가 3자리라면
                 if(firstNb2 == phoneArr[i]) {
               	  var phoneLength = phone.substr(firstNb2.length);
               	
               	  if(phoneLength.length == 8){
                     var secNb = phone.substr(firstNb2.length,lastNb.length);
                     
                     if(boolean){
                         $("#" + inputId1).val(firstNb2);
                         $("#" + inputId2).val(secNb);
                         $("#" + inputId3).val(lastNb);
                         }else return firstNb2 + "-" + secNb + "-" + lastNb;
               	  }else{
               		  var secNb = phone.substr(firstNb2.length,lastNb.length-1);
                         
               		if(boolean){
                        $("#" + inputId1).val(firstNb2);
                        $("#" + inputId2).val(secNb);
                        $("#" + inputId3).val(lastNb);
                        }else return firstNb2 + "-" + secNb + "-" + lastNb;  
               	  }
                     //3자리이면 앞자리 4자리인지 체크 안함
                     firstNumCheck = false;
                     break;
                 }
             }
            if(firstNumCheck){
                var secNb = "";
               
                //앞자리가 4자리면 나머지 자릿수 체크해 알맞게 셋팅한다.
                var chkNum = phone.substr(firstNb3.length);
               
                if(chkNum.length == 7) secNb =phone.substr(firstNb3.length,lastNb.length-1);
                else secNb = phone.substr(firstNb3.length,lastNb.length);
                
               
                if(boolean){
                    $("#" + inputId1).val(firstNb3);
                    $("#" + inputId2).val(secNb);
                    $("#" + inputId3).val(lastNb);
                    }else return firstNb3 + "-" + secNb + "-" + lastNb;
            }
        }

    }
    
    /**
     * 비동기 페이징 처리
     * @param selector :: pagination Div id, cpage :: currentPage, data :: Json 반환값 1. totalPage 수 2. totalCount :: 조회해온 전체 목록 수, pn :: function 이름, 이미지 경로
     * @return 포맷된 값
     */
  this.setPaging = function(selector, cpage, data, pn) {
    
      if(data.totalCount ==0||data==null||data==''){

          $(selector).html('');

      }else{
          cpage = Number(cpage);
          var start = Math.floor((cpage - 1) / 10) * 10 + 1;
         
          var end = start + 9 < data.totalpage ? start + 9 : data.totalpage;
          var html = "";
        
          if (start - 1 > 0) {
              html += '<a href="javascript:'+pn+'(\''+(start - 1)+'\');"><img src="/imges/ico_lt_1.png" alt=""></a>';
          }
          if (cpage > 1) {
              html += '<a href="javascript:'+pn+'(\''+(cpage - 1)+'\');"><img src="/imges/ico_lt.png" alt=""></a>';
          }

          for (var i = start; i <= end; i++) {
              if (i == cpage) {
                 
                  html += '<a class="active" href="javascript:'+pn+'(\''+i+'\');">'+i+'</a>';
              }else{
                  html += '<a href="javascript:'+pn+'(\''+i+'\');">'+i+'</a>';
              }
          }
          if (cpage < data.totalpage) {
              html += '<a href="javascript:'+pn+'(\''+(cpage + 1)+'\');"><img src="/imges/ico_gt.png" alt=""></a>';
          }
          if (end < data.totalpage) {
              html += '<a href="javascript:'+pn+'(\''+(end + 1)+'\');"><img src="/imges/ico_gt_1.png" alt=""></a>';
          }

          $(selector).html(html);
      }
  }
  
  /**
   * 날짜 연결 문자 삭제
   * @param value 문자열
   * @return 문자열
   */
  this.clearDateChar = function(value) {
	    var flowName = this.className+".clearDateChar() ";
	    try {
		    var regex = /[^0-9]/g;
          return value.replace(regex, "");
      } catch(e) {
          e.message = flowName+e.message;
          throw e;
      }
	}
  
  /**
   * 오늘날짜 가져오기 
   * @return yyyyMMdd
   */
  this.sysDate = function() {
	
    var d = new Date();
    var year = d.getFullYear().toString();
    var month = (d.getMonth()+1).toString();
    if(month.length == 1) month = "0" + month;
    var day = d.getDate().toString();
    if(day.length == 1) day = "0" + day;
    var hours = d.getHours().toString();
	 
	    return year+month+day;
	}
  
  
  /**
   * 아이디 검사
   * @param value 문자열
   * @return true/false
   */
  this.isId = function(value) {
      var flowName = this.className+".isId() ";
      try {
          var pattern = /^[a-z0-9]+[a-z0-9]{5,12}$/g;
          return pattern.test(value) ? true : false;
      } catch(e) {
          e.message = flowName+e.message;
          throw e;
      }
  }

  /**
   * 비밀번호 검사
   * @param value 문자열
   * @return true/false
   */
  this.isPassword = function(value) {
      var flowName = this.className+".isPassword() ";
      try {
          var pattern = /^(?=.*[a-zA-Z])(?=.*[!@#$%_^*+=-])(?=.*[0-9]).{6,16}$/;
          return pattern.test(value) ? true : false;
      } catch(e) {
          e.message = flowName+e.message;
          throw e;
      }
  }

  /**
   * 이메일 검사
   * @param value 문자열
   * @return true/false
   */    
	this.isEmail = function(value) {
	    var flowName = this.className+".isEmail() ";
	    try {
		    var pattern = /^[_a-zA-Z0-9-\.]+@[\.a-zA-Z0-9-]+\.[a-zA-Z]+$/;
		    return pattern.test(value) ? true : false;
      } catch(e) {
          e.message = flowName+e.message;
          throw e;
      }
	}
	
	
	/**
	   * 전체선택 전체 해제
	   * @param value 문자열
	   * @return true/false
	   */    
		this.chkAll = function(classNm,checker) {
		        if(checker){
		        	$("." + classNm).prop("checked", true);
		        }else{
		        	$("." + classNm).prop("checked", false);
		        }
		   
		}
		/**
		   * 숫자(천단위)콤마 찍기
		   * @param value 문자열
		   * @return string
		   */  
		this.comma = function(value){
			value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			return value;
		}
        
        /**
		   * 내위치 위도 경도 얻기.
		   * @param value none
		   * @return x,y
		   */  
        this.getLocation = function(date){
            var value = "";
            if (navigator.geolocation) { // GPS를 지원하면
                navigator.geolocation.getCurrentPosition(function(position) {
                  getLoadName(date,position.coords.latitude, position.coords.longitude);
                }, function(error) {
                  console.error(error);
                }, {
                  enableHighAccuracy: false,
                  maximumAge: 0,
                  timeout: Infinity
                });
              } else {
                alert('GPS를 지원하지 않습니다');
              }
        }

        this.changeXY = function (code,v1,v2){
 
            let RE = 6371.00877; // 지구 반경(km)
            let GRID = 5.0; // 격자 간격(km)
            let SLAT1 = 30.0; // 투영 위도1(degree)
            let SLAT2 = 60.0; // 투영 위도2(degree)
            let OLON = 126.0; // 기준점 경도(degree)
            let OLAT = 38.0; // 기준점 위도(degree)
            let XO = 43; // 기준점 X좌표(GRID)
            let YO = 136; // 기1준점 Y좌표(GRID)
            // LCC DFS 좌표변환 ( code : "toXY"(위경도->좌표, v1:위도, v2:경도), "toLL"(좌표->위경도,v1:x, v2:y) )

            let DEGRAD = Math.PI / 180.0;
            let RADDEG = 180.0 / Math.PI;
    
            let re = RE / GRID;
            let slat1 = SLAT1 * DEGRAD;
            let slat2 = SLAT2 * DEGRAD;
            let olon = OLON * DEGRAD;
            let olat = OLAT * DEGRAD;
    
            let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
            sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
            let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
            sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
            let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
            ro = re * sf / Math.pow(ro, sn);
            let rs = {};
            if (code == "toXY") {
                rs['lat'] = v1;
                rs['lng'] = v2;
                let ra = Math.tan(Math.PI * 0.25 + (v1) * DEGRAD * 0.5);
                ra = re * sf / Math.pow(ra, sn);
                let theta = v2 * DEGRAD - olon;
                if (theta > Math.PI) theta -= 2.0 * Math.PI;
                if (theta < -Math.PI) theta += 2.0 * Math.PI;
                theta *= sn;
                rs['x'] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
                rs['y'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
            }
            else {
                rs['x'] = v1;
                rs['y'] = v2;
                let xn = v1 - XO;
                let yn = ro - v2 + YO;
                ra = Math.sqrt(xn * xn + yn * yn);
                if (sn < 0.0) - ra;
                let alat = Math.pow((re * sf / ra), (1.0 / sn));
                alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;
    
                if (Math.abs(xn) <= 0.0) {
                    theta = 0.0;
                }
                else {
                    if (Math.abs(yn) <= 0.0) {
                        theta = Math.PI * 0.5;
                        if (xn < 0.0) - theta;
                    }
                    else theta = Math.atan2(xn, yn);
                }
                let alon = theta / sn + olon;
                rs['lat'] = alat * RADDEG;
                rs['lng'] = alon * RADDEG;
            }
            return rs;
        }
        /*
            * Description : 이미지 리사이징 하여 출력.
            * id : rendering 영역 id
            * file : file 속성 파일 값. input[0].files[0]
            * w : width 값
            * h : height 값
        */
        this.resizeImg = function(id,file,w,h){
            var reader = new FileReader();
            reader.readAsDataURL(file); //파일을 읽는 메서드
        
            reader.onload = function(){
              var img = new Image();
              img.src = reader.result;
              img.width = w;
              img.height = h;
              $("#" + id).html(img);
            }
        },
        /**
         * 모바일 pc 체크 function
         */
        this.isMobile = function(){
            var user = navigator.userAgent; 
            var is_mobile = false; 
            if( user.indexOf("iPhone") > -1 || user.indexOf("Android") > -1 ) { 
                is_mobile = true; 
            } 
            return is_mobile;
        }
	
}
