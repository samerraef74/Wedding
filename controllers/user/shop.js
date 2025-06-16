import Product from "../../models/Product.js";
import Service from "../../models/service.js";
import User from "../../models/User.js";

const shop_get = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    let myproducts = [];
    let myservices = [];

    // Check if user.cart exists to avoid undefined error
    if (user.cart) {
      for (let p of user.cart.products || []) {
        const data = await Product.findById(p.productId).lean();
        if (data) {
          data.quantity = p.productQuantity;
          myproducts.push(data);
        }
      }

      for (let s of user.cart.services || []) {
        const data = await Service.findById(s.serviceId).lean();
        if (data) {
          data.quantity = s.serviceQuantity;
          myservices.push(data);
        }
      }
    }

    res.render("./shop.ejs", {
      title: "Shop",
      user,
      myproducts,
      myservices,
      products: await Product.find(),
    });
  } catch (error) {
    console.error("Error in shop_get:", error);
    res.status(500).send("Internal Server Error");
  }
};

export default { shop_get };
