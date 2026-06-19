package com.Ecomm.prj.Service;

import com.Ecomm.prj.Dto.CartDto;
import com.Ecomm.prj.Model.Cart;
import com.Ecomm.prj.Model.Product;
import com.Ecomm.prj.Model.User;
import com.Ecomm.prj.repository.CartRepo;
import com.Ecomm.prj.repository.ProductRepository;
import com.Ecomm.prj.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Optional;

@Service
public class cartService {

    @Autowired
    private CartRepo cartrepo;
    @Autowired
    private UserRepo userrepo;
    @Autowired
    private ProductRepository productrepo;

    @Transactional
    public Cart addToCart(CartDto dto) {

        if (dto == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request body is required");
        }
        if (dto.getUserId() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "userId must be greater than 0");
        }
        if (dto.getProductId() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "productId must be greater than 0");
        }
        if (dto.getQuantity() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "quantity must be greater than 0");
        }

        System.out.println("UserId = " + dto.getUserId());
        System.out.println("ProductId = " + dto.getProductId());
        System.out.println("Quantity = " + dto.getQuantity());


        User user = userrepo.findById((long) dto.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + dto.getUserId()));
        Product product = productrepo.findById((long) dto.getProductId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found: " + dto.getProductId()));

        Optional<Cart> existingCartItem = cartrepo.findByUserAndProduct(user, product);

        if (existingCartItem.isPresent()) {
            Cart cart = existingCartItem.get();
            cart.setQuantity(cart.getQuantity() + dto.getQuantity());
            return cartrepo.save(cart);
        } else {
            Cart cart = new Cart();
            cart.setUser(user);
            cart.setProduct(product);
            cart.setQuantity(dto.getQuantity());
            return cartrepo.save(cart);
        }
    }

    public List<Cart> getCartByUser(int userId) {
        if (userId <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "userId must be greater than 0");
        }
        User user = userrepo.findById((long) userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + userId));

        return cartrepo.findByUser(user);
    }
    public void removeCart(int cartId) {
        if (cartId <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "cartId must be greater than 0");
        }
        cartrepo.deleteById(cartId);
    }

    public Cart updateQuantity(int cartId, int quantity) {
        if (cartId <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "cartId must be greater than 0");
        }
        if (quantity <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "quantity must be greater than 0");
        }
        Cart cart = cartrepo.findById(cartId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart not found: " + cartId));
        cart.setQuantity(quantity);

        return cartrepo.save(cart);
    }
}
