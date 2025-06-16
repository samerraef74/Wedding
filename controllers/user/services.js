import Service from "../../models/service.js";
import Product from "../../models/Product.js";
import User from "../../models/User.js";

const services_get = async (req, res) => {
  const user = await User.findById(req.params.id);

  let myproducts = [];
  let myservices = [];

  for (let p of user.cart.products) {
    let data = await Product.findById(p.productId).lean();
    data.quantity = p.productQuantity;
    myproducts.push(data);
  }

  for (let s of user.cart.services) {
    let data = await Service.findById(s.serviceId).lean();
    data.quantity = s.serviceQuantity;
    myservices.push(data);
  }

  res.render("services.ejs", {
    title: "Services",
    user,
    myproducts,
    myservices,
    services: await Service.find(),
  });
};

export default { services_get };
