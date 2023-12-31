const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.path = path;
  }
  //corroborar si el archivo existe:
  fileExist() {
    return fs.existsSync(this.path);
  }
  //consultar productos
  async getProduct() {
    try {
      if (this.fileExist()) {
        //leer contenido
        const contenido = await fs.promises.readFile(this.path, "utf-8");
        //transformar contenido a json
        const contenidoJson = JSON.parse(contenido);
        console.log("all products: ", contenidoJson);
      }
    } catch (error) {
      console.error("get products error: ", error.message);
    }
  }
  //agregar productos
  async addProduct(productInfo) {
    try {
      if (this.fileExist()) {
        const contenido = await fs.promises.readFile(this.path, "utf-8");
        const contenidoJson = JSON.parse(contenido);

        //validar que todos los campos sean obligatorios
        const requiredFields = [
          "title",
          "description",
          "price",
          "thumbnail",
          "code",
          "stock",
        ];
        const missingFields = requiredFields.filter(
          (field) => !productInfo.hasOwnProperty(field)
        );
        if (missingFields.length > 0) {
          console.error(`${missingFields.join(",")} is a required field`);
          return;
        } else {
          //validar unico code
          const codeExist = contenidoJson.some((product) => {
            product.code === productInfo.code;
          });
          if (codeExist) {
            console.log(`code ${productInfo.code} already exists!`);
          } else {
            //id autoincrementable
            const id = contenidoJson.reduce((maxId, product) => {
              return product.id > maxId ? product.id : maxId;
            }, 0);
            const newId = id + 1;
            productInfo.id = newId;
            //agregar producto
            contenidoJson.push(productInfo);
            await fs.promises.writeFile(
              this.path,
              JSON.stringify(contenidoJson, null, "\t")
            );
            console.log(`${productInfo.title} added successfully`);
          }
        }
      }
    } catch (error) {
      console.error("add product error: ", error.message);
    }
  }

  //get product by id
  async getProductById(id) {
    try {
      if (this.fileExist()) {
        const contenido = await fs.promises.readFile(this.path, "utf-8");
        const contenidoJson = JSON.parse(contenido);

        //metodo find para encontrar id
        const product = contenidoJson.find((product) => product.id === id);

        if (product) {
          console.log(`product ID ${id}: `, product);
        } else {
          console.log("ID not found");
        }
      }
    } catch (error) {
      console.error("get product by id error: ", error.message);
    }
  }

  //modificar productos
  async updateProduct(id, updatedContent) {
    try {
      if (this.fileExist()) {
        const contenido = await fs.promises.readFile(this.path, "utf-8");
        const contenidoJson = JSON.parse(contenido);

        //localizar el id
        const productIndex = contenidoJson.findIndex((product) => {
          return product.id === id;
        });
        if (productIndex !== -1) {
          contenidoJson[productIndex] = {
            ...contenidoJson[productIndex],
            ...updatedContent,
          };

          //actualiza
          await fs.promises.writeFile(
            this.path,
            JSON.stringify(contenidoJson, null, "\t")
          );
          console.log("product updated successfully");
        } else {
          console.log("can't update product, id not found");
        }
      }
    } catch (error) {
      console.error("update product error: ", error);
    }
  }

  //eliminar products
  async deleteProduct(id) {
    try {
      if (this.fileExist()) {
        const contenido = await fs.promises.readFile(this.path, "utf-8");
        const contenidoJson = JSON.parse(contenido);

        //metodo filter que crea un nuevo arreglo, excluyendo el producto seleccionado
        const newArray = contenidoJson.filter((product) => product.id !== id);
        //se sobreescribe en el archivo, el nuevo arreglo actualizado
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(newArray, null, "\t")
        );
        console.log("product successfully removed");
      }
    } catch (error) {
      console.error("delete products error: ", error);
    }
  }
}
//creacion de la instancia
const manager = async () => {
  try {
    const productManager = new ProductManager("./products.json");
    //add products:
    await productManager.addProduct({
      title: "Hoodie Galaxy",
      description: "Black oversize hoodie",
      price: 15500,
      thumbnail:
        "https://res.cloudinary.com/dqrgdohtt/image/upload/v1687800305/hoodieGalaxy_mfam50.jpg",
      code: "PROD1",
      stock: 3,
    });
    await productManager.addProduct({
      title: "Cosmo Dress",
      description: "Short black strapless leather dress",
      price: 13000,
      thumbnail:
        "https://res.cloudinary.com/dqrgdohtt/image/upload/v1687800303/cosmoDress_e6b1ry.jpg",
      code: "PROD2",
      stock: 2,
    });
    await productManager.addProduct({
      title: "Body Rocket",
      price: 10200,
      thumbnail:
        "https://res.cloudinary.com/dqrgdohtt/image/upload/v1687800304/bodyRocket_d7hikz.jpg",
      code: "PROD3",
      stock: 4,
    });
    //get products:
    await productManager.getProduct();
    //get product by id:
    await productManager.getProductById(2);
    //update product:
    await productManager.updateProduct(1, { price: 17000 });
    //delete product:
    await productManager.deleteProduct(2);
  } catch (error) {
    console.log("error: ", error.message);
  }
};
manager();
