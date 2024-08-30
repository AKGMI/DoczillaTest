package com.task2;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;

public class Main {
    public static void main(String[] args) throws Exception {
        Server server = new Server(8080);

        ServletContextHandler handler = new ServletContextHandler(ServletContextHandler.SESSIONS);
        handler.setContextPath("/");
        server.setHandler(handler);

        ServletHolder holder = new ServletHolder();
        holder.setServlet(new StudentServlet());
        handler.addServlet(holder, "/students");

        server.start();
        server.join();
    }
}
