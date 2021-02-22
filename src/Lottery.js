export const lotteryAbi =[
    {
        'constant': true,
        'inputs': [],
        'name': "manager",
        'outputs': [
            {
                'name': "",
                'type': "address"
            }
        ],
        'payable': false,
        'stateMutability': "view",
        'type': "function"
    },
    {
        'constant': false,
        'inputs': [],
        'name': "pickWinner",
        'outputs': [],
        'payable': false,
        'stateMutability': "nonpayable",
        'type': "function"
    },
    {
        'constant': true,
        'inputs': [],
        'name': "getPlayers",
        'outputs': [
            {
                'name': "",
                'type': "address[]"
            }
        ],
        'payable': false,
        'stateMutability': "view",
        'type': "function"
    },
    {
        'constant': true,
        'inputs': [
            {
                'name': "",
                'type': "uint256"
            }
        ],
        'name': "players",
        'outputs': [
            {
                'name': "",
                'type': "address"
            }
        ],
        'payable': false,
        'stateMutability': "view",
        'type': "function"
    },
    {
        'inputs': [],
        'name': "constructor",
        'payable': false,
        'stateMutability': "nonpayable",
        'type': "constructor"
    },
    {
        'payable': true,
        'stateMutability': "payable",
        'type': "fallback"
    }
]
