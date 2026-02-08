package moneyTransferAltVersion

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
    // <editor-fold desc="DestinationAccount role">
    fun MoneyDestination.deposit() {
        increaseBalance(amount)
    }
    // </editor-fold>

    // <editor-fold desc="SourceAccount role">
    fun MoneySource.withdraw() {
        decreaseBalance(amount)
    }

    fun MoneySource.transferToDestination() {
        if (balance < destination.balance) {
            throw IllegalArgumentException("Insufficient funds")
        }
        withdraw()
        destination.deposit()
    }
    // </editor-fold>

    source.transferToDestination()
}

fun main() {
    val sourceAcct = Account(30)
    val destinationAcct = Account(30)

    TransferMoney(sourceAcct, destinationAcct, 10)

    println("sourceAcct ${sourceAcct.balance}")
    println("destinationAcct ${destinationAcct.balance}")
}
