package moneyTransfer

class Account(private var _balance: Int): MoneySource, MoneyDestination  {
    override val balance: Int
        get() = _balance

    override fun increaseBalance(amount: Int) {
        _balance += amount
    }

    override fun decreaseBalance(amount: Int) {
        _balance -= amount
    }
}

interface MoneySource {
    fun decreaseBalance(amount: Int): Unit
    val balance: Int
}

interface MoneyDestination {
    fun increaseBalance(amount: Int): Unit
    val balance: Int
}

fun TransferMoney(
    source: MoneySource,
    destination: MoneyDestination,
    amount: Int
) {
    class DestinationAccountRole {
        fun MoneyDestination.deposit() {
            increaseBalance(amount)
        }
    }

    class SourceAccountRole {
        fun MoneySource.transferToDestination() {
            require (balance >= destination.balance, {"Insufficient funds"})
            withdraw()
            with (DestinationAccountRole()) {
                destination.deposit()
            }
        }

        private fun MoneySource.withdraw() {
            decreaseBalance(amount)
        }
    }

    with (SourceAccountRole()) {
        source.transferToDestination()
    }
}

fun main() {
    val sourceAcct = Account(30)
    val destinationAcct = Account(30)

    TransferMoney(sourceAcct, destinationAcct, 10)

    println("sourceAcct ${sourceAcct.balance}")
    println("destinationAcct ${destinationAcct.balance}")
}
