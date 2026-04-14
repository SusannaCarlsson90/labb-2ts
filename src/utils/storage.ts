//Kod från: https://medium.com/@mithileshparmar1/simplifying-local-storage-with-typescript-1ac866ed5f40 . Mina kommentarer för att förstå koden ordentligt

const StorageKeys = { //Objekt som innehåller de namn (namnet i detta fall) som jag vill använda i minnet
  TODOS: 'TODOS',
} as const;

export type StorageKeysType = (typeof StorageKeys)[keyof typeof StorageKeys]; //Får bara använda namenen som finns i mitt objekt, annars varnar TypeScript 


  class StorageUtility { // Skapar en klass för att hantera allt som ska sparas eller hämtas. Genom att använda "static" kan jag använda verktygen direkt utan att skapa objekt
  static setItem<T>(key: StorageKeysType, value: T): void { // Verktyg för att spara något i minnet. Den gör om min data till text
    try {
      const jsonValue = JSON.stringify(value);
      localStorage.setItem(key, jsonValue);
    } catch (e) {}
  }

  static getItem<T>(key: StorageKeysType): T | null { //Verktyg för att hämta något från minnet. Den hämtar texten och gör om den till en vanlig lista/objekt igen 
    try {
      const jsonValue = localStorage.getItem(key);
      const value = jsonValue != null ? JSON.parse(jsonValue) : null;
      return value;
    } catch (e) {
      return null;
    }
  }

  static removeItem(key: StorageKeysType): void { //Verktyg för att ta bort en specifik sak 
    try {
      localStorage.removeItem(key);
    } catch (e) {}
  }

  static clear(): void { //Verktyg för att rensa ALLT som sparats i webbläsaren
    try {
      localStorage.clear();
    } catch (error) {}
  }
 }

export { StorageUtility, StorageKeys };