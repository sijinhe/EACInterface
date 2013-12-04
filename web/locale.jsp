<%@page import="java.io.File"%>
<%@page import="java.lang.annotation.*,java.sql.*,java.util.*,org.apache.commons.lang.*,java.lang.reflect.*"%>
<%@page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" isErrorPage="false" isThreadSafe="true" %>
<%
response.setContentType("text/plain");
response.setHeader("Cache-Control", "no-cache,no-store,must-revalidate"); //HTTP 1.1
response.setHeader("Pragma","no-cache"); //HTTP 1.0
response.setDateHeader ("Expires", -1); //prevents caching at the proxy server

String locale="zh_CN"; // default
//String locale="en_GB"; // default

Cookie[] cookies=request.getCookies();
for(int i=0; null!=cookies && i<cookies.length; i++) {
  if(cookies[i].getName().equalsIgnoreCase("locale")) {
    locale=cookies[i].getValue();
    break;
  }
}

response.setHeader("Location", "js/i18n/"+locale+".js"+"?_="+System.currentTimeMillis());
response.setStatus(303);

%>