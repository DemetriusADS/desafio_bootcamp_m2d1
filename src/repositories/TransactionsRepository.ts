import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  private balance: Balance;

  constructor() {
    this.transactions = [];
    this.balance = {
      income: 0,
      outcome: 0,
      total: 0,
    };
  }

  public all(): Transaction[] {
    const transaction = this.transactions.map(transactionI => transactionI);

    return transaction;
  }

  public getBalance(): Balance {
    const incomeArray = this.transactions.map(transactionI => {
      if (transactionI.type === 'income') {
        return transactionI.value;
      }
      return 0;
    });
    const outcomeArray = this.transactions.map(transactionI => {
      if (transactionI.type === 'outcome') {
        return transactionI.value;
      }
      return 0;
    });
    const income = incomeArray.reduce(
      (incomeComputed, actualValue) => incomeComputed + actualValue,
    );
    const outcome = outcomeArray.reduce(
      (incomeComputed, actualValue) => incomeComputed + actualValue,
    );
    const total = income - outcome;

    this.balance = {
      income,
      outcome,
      total,
    };
    return this.balance;
  }

  public create({ title, value, type }: TransactionDTO): Transaction {
    if (type === 'outcome' && this.balance.total < value) {
      throw Error("You haven't enought money");
    }
    const transaction = new Transaction({ title, value, type });
    this.transactions.push(transaction);
    this.getBalance();
    return transaction;
  }
}

export default TransactionsRepository;
