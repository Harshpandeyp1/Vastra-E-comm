package com.Ecomm.prj.Controller;

import com.Ecomm.prj.Dto.HomeResponse;
import com.Ecomm.prj.Service.HomeService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class HomeController {
   private final HomeService service;
   public HomeController(HomeService service){
       this.service=service;
   }
   @GetMapping("/home")
    public HomeResponse getHome(){
       return service.getHomeData();
   }

}
