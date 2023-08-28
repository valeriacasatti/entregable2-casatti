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

        //validar unico code
        const codeExist = contenidoJson.some((product) => {
          product.code === productInfo.code;
        });
        if (codeExist) {
          console.log(`el codigo ${productInfo.code} ya existe!`);
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
          console.log(`${productInfo.title} agregado exitosamente`);
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
  async updateProduct(id, updatedProduct) {
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
            ...updatedProduct,
          };

          //actualiza
          await fs.promises.writeFile(
            this.path,
            JSON.stringify(contenidoJson, null, "\t")
          );
          console.log("producto actualizado correctamente");
        } else {
          console.log("no se encontro el ID");
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
        console.log("producto eliminado correctamente");
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
