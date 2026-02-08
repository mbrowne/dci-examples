package moneyTransferAltVersion

class Account(private var _balance: Int): MoneySource, moneyTransfer.MoneyDestination {
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

fun TransferMoneyAltVersion(
    source: MoneySource,
    destination: moneyTransfer.MoneyDestination,
    amount: Int
) {
    // <editor-fold desc="roles">
    class DestinationAccountRole {
        fun moneyTransfer.MoneyDestination.deposit() {
            increaseBalance(amount)
        }
    }

    class SourceAccountRole {
        fun MoneySource.transferToDestination() {
            if (source.balance < destination.balance) {
                throw IllegalArgumentException("Insufficient funds")
            }
            source.withdraw()
            with (DestinationAccountRole()) {
                destination.deposit()
            }
        }

        private fun MoneySource.withdraw() {
            decreaseBalance(amount)
        }
    }
    // </editor-fold>

    with (SourceAccountRole()) {
        source.transferToDestination()
    }
}

fun main() {
    val sourceAcct = Account(30)
    val destinationAcct = Account(30)

    TransferMoneyAltVersion(sourceAcct, destinationAcct, 10)

    println("sourceAcct balance=${sourceAcct.balance}")
    println("destinationAcct balance=${destinationAcct.balance}")
}
