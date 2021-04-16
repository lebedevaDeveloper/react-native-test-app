import SQLite from "react-native-sqlite-storage";

SQLite.DEBUG(false);
SQLite.enablePromise(false);

export const executeQuery = (sql, params = []) => new Promise((resolve, reject) => {
  db.transaction((trans) => {
    trans.executeSql(sql, params, (trans, results) => {
        resolve(results);
      },
      (error) => {
        reject(error);
      });
  });
});
