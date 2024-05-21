const router = require("express").Router();
const bagManager = require("../managers/bagManager");
const {
  DEFAULT_ADD_QUANTITY,
  DEFAULT_MIN_QUANTITY,
} = require("../constants/shoppingBag");
const shoppingBag = require("../models/ShoppingBag");
const Inventory = require("../models/Inventory");

router.get("/display/:user", async (req, res) => {
  try {
    const user = req.params.user;

    const jewelries = await bagManager.getAll(user);

    res.status(200).json({ jewelries, DEFAULT_MIN_QUANTITY });
  } catch (err) {
    console.log(err.message);

    res.status(400).json({
      message: "Some error",
    });
  }
});

router.post("/add/:jewelryId", async (req, res) => {
  const userUUID = req.headers["user-uuid"];
  const { size } = req.body;

  let userId;

  if (req.user) {
    userId = req.user._id;
  }

  const jewelryId = Number(req.params.jewelryId);

  try {
    let bagItem;
    let sizeId;

    const isAvailable = await Inventory.findOne({
      jewelry: jewelryId,
      size: Number(size),
      quantity: { $gt: 0 },
    });

    if (!size) {
      throw new Error("Ensure you have selected the desired size.");
    } else if (!isAvailable) {
      throw new Error("The jewelry has been sold out.");
    } else {
      sizeId = Number(size);

      bagItem = await bagManager.getOne({
        userId,
        userUUID,
        jewelryId,
        sizeId,
      });
    }

    if (!bagItem) {
      await bagManager.create({
        userId,
        userUUID,
        jewelryId,
        sizeId,
        quantity: DEFAULT_ADD_QUANTITY,
      });
    } else {
      newQuantity = Number(bagItem.quantity) + DEFAULT_ADD_QUANTITY;
      await shoppingBag.findOneAndUpdate(
        {
          user: userId,
          userUUID,
          jewelry: jewelryId,
          size: sizeId,
        },
        { quantity: newQuantity }
      );

      await Inventory.findOneAndUpdate(
        { jewelry: jewelryId, size: sizeId },
        { $inc: { quantity: -1 } },
        { new: true }
      );
    }

    const allBagItems = await shoppingBag.find({
      $or: [{ user: userId }, { userUUID: userUUID }],
    });

    res.json(allBagItems);
  } catch (err) {
    console.log(err.message);

    res.status(400).json({
      message: "Some error",
    });
  }
});

router.put("/decrease/:bagId", async (req, res) => {
  bagId = req.params.bagId;

  try {
    await bagManager.decrease(bagId);

    res.status(204).json();
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

router.put("/increase/:bagId", async (req, res) => {
  bagId = req.params.bagId;

  try {
    await bagManager.increase(bagId);

    res.status(204).json();
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

router.put("/update/:bagId", async (req, res) => {
  bagId = req.params.bagId;

  const { quantity } = req.body;

  try {
    await bagManager.update(bagId, quantity);

    res.status(204).json();
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

router.delete("/delete/:bagId", async (req, res) => {
  bagId = req.params.bagId;

  try {
    await bagManager.delete(bagId);

    res.status(204).json();
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

module.exports = router;
