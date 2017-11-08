var field;

var GameFieldCanvas = document.createElement("canvas");
GameFieldCanvas.style.position = 'absolute';
var GameFieldCanvasContext = GameFieldCanvas.getContext('2d');

var ScoreBarCanvas = document.createElement("canvas");
ScoreBarCanvas.style.position = 'absolute';
var ScoreBarCanvasContext = ScoreBarCanvas.getContext('2d');

var body = document.getElementsByTagName("body")[0]
body.appendChild(ScoreBarCanvas);
body.appendChild(GameFieldCanvas);

const BackgroundColor = ['#0D0F08'];
const NotEmptyFieldBackgroundColor = ['#407F33'];
const NotEmptyFieldFontColor = ['#D1F0E3']
const fontColor = 'rgb(0, 0, 0)';
const Padding = 6;

var Score;
var Iteration;
var lineElementsCount = 4;
var tableElementsCount = 4;
var isMoveFinished = false;

function RestartGameManual()
{
    ChangeEventHandler();
}

function ChangeEventHandler()
{
    GameFieldCanvas.height = document.getElementById("Height").value;
    GameFieldCanvas.width = document.getElementById("Width").value;
    
    ScoreBarCanvas.height = GameFieldCanvas.height + 100;
    ScoreBarCanvas.width = GameFieldCanvas.width + 300;

    lineElementsCount = +document.getElementById("ColumnsCount").value;
    tableElementsCount = +document.getElementById("RowsCount").value;
    
    GameInit();
}

var colors = {
    BackgroundColor: {
      "2": "#EEE4DA",
      "4": "#EDE0C8",
      "8": "#F2B179",
      "16": "#f59563",
      "32": "#f67c5f",
      "64": "#F65E3B",
      "128": "#EDCF72",
      "256": "#EDCC61",
      "512": "#EDC850",
      "1024": "#EDC53F",
      "2048": "#EDC22E"
    },
    fontColor: {
      "2": "#776e65",
      "4": "#776e65",
      "8": "#f9f6f2",
      "16": "#f9f6f2",
      "32": "#f9f6f2",
      "64": "#f9f6f2",
      "128": "#f9f6f2",
      "256": "#f9f6f2",
      "512": "#f9f6f2",
      "1024": "#f9f6f2",
      "2048": "#f9f6f2"
    }
  }

GameInit();
ChangeEventHandler();

function GameInit()
{
    Score = 0;
    Iteration = 0;
    field = new Array(lineElementsCount * tableElementsCount).fill(0);
    GenerateItems();
    GenerateItems();
    Render();
}

function WaitMove(Directory)
{
    ;
}

function GameOver()
{
    console.log("GameOver!");
    GameInit();
}

function GenerateItems()
{
    var array = new Array();
    for (var i = 0; i < field.length; ++i)
    {
        if (field[i] == 0)
        {
            array.push(i);
        }
    }
    if (array.length == 0)
    {
        GameOver();
    }
    else
    {
        var GeneratedItem = (Math.random() * 2 | 0) + 1;
        var position = array[(Math.random() * array.length) | 0];
        field[position] = GeneratedItem;
        Score += Math.pow(2, GeneratedItem);
    }
}

function KeyDownEventListner(sender, e)
{
    if(MoveHandler(sender.keyCode - 38))
    {
        ++Iteration;
        GenerateItems();
        //GenerateItems();
        Render();
    }
}

function MoveHandler(keyCode)
{
    var KeyDirection = null;
    isMoveFinished = false;

    for (var j = 0; j < Math.max(tableElementsCount, lineElementsCount); ++j)
    {
        switch (keyCode)
        {
            case -1:
                Move(1, field.length, -1, function(i){ return i % lineElementsCount != 0 })
                break;
            case 1:
                RMove(field.length - 1, 0, 1, function(i){ return (i + 1) % lineElementsCount != 0 })
                break;
            case 0:
                Move(lineElementsCount, field.length, -lineElementsCount, function(i){ return !(i < lineElementsCount) });
                //console.log(lineElementsCount + "   " + field.length);
                break;
            case 2:
                RMove(field.length - lineElementsCount, 0, lineElementsCount, function(i) { return !(i > lineElementsCount * tableElementsCount - 1) });
                break;
            default:
                break;
        }

        function Move(loopStart, loopEnd, sign, TestFunction)
        {
            for (var i = loopStart; i < loopEnd - (loopStart + sign); ++i)
            {
                if (TestFunction(i) && field[i] != 0)
                {
                    if (field[i + (1 * sign)] == 0)
                    {
                        field[i + (1 * sign)] = field[i];
                        field[i] = 0;
                        isMoveFinished = true;
                    }
                    else
                    {
                        if (field[i + (1 * sign)] == field[i])
                        {
                            ++field[i + (1 * sign)];
                            field[i] = 0;
                            Score += Math.pow(2, field[i + (1 * sign)]);
                            isMoveFinished = true;
                        }
                    }
                }
            }
        }

        function RMove(loopStart, loopEnd, sign, TestFunction)
        {
            for (var i = loopStart; i >= loopEnd; --i)
            {
                if (TestFunction(i) && field[i] != 0)
                {
                    if (field[i + (1 * sign)] == 0)
                    {
                        field[i + (1 * sign)] = field[i];
                        field[i] = 0;
                        isMoveFinished = true;
                    }
                    else
                    {
                        if (field[i + (1 * sign)] == field[i])
                        {
                            ++field[i + (1 * sign)];
                            field[i] = 0;
                            Score += Math.pow(2, field[i + (1 * sign)]);
                            isMoveFinished = true;
                        }
                    }
                }
            }
        }
    }
    return (keyCode >= -1 && keyCode <= 2) && isMoveFinished;
}

function GetSpecialHeight()
{
    return GameFieldCanvas.height / tableElementsCount - Padding / tableElementsCount;
}

function GetSpecialWidth()
{
    return GameFieldCanvas.width / lineElementsCount - Padding / lineElementsCount;
}

function GetRequiredFontSize()
{
    return (GetSpecialWidth() - Padding * 2 - 1) / (Math.pow(2, field.reduce((maxValue, value) => maxValue < value ? value : maxValue)) + "").length;
}

function Render()
{
    function DrawScoreBar()
    {
        ScoreBarCanvasContext.fillStyle = ['#D0F0A3'];
        ScoreBarCanvasContext.fillRect(0, 0, ScoreBarCanvas.width, ScoreBarCanvas.height);
        ScoreBarCanvasContext.fillStyle = fontColor;
        ScoreBarCanvasContext.fillText('Score: ' + Score, 0, GameFieldCanvas.height + 5);
        ScoreBarCanvasContext.fillText('Iteration: ' + Iteration, 0, GameFieldCanvas.height + GetRequiredFontSize() + 5);
    }
    function InitRender()
    {
        ScoreBarCanvasContext.textAlign = "left";
        ScoreBarCanvasContext.textBaseline = "top";
        ScoreBarCanvasContext.font = "bold " + GetRequiredFontSize() + "px Arial";

        GameFieldCanvasContext.textAlign = "center";
        GameFieldCanvasContext.textBaseline = "middle";
        GameFieldCanvasContext.font = "bold " + GetRequiredFontSize() + "px Arial";
        xOffset = 0;
        yOffset = 0;
    }
    function DrawGameField()
    {
        GameFieldCanvasContext.fillStyle = BackgroundColor;
        GameFieldCanvasContext.fillRect(0, 0, GameFieldCanvas.width, GameFieldCanvas.height);
        for (var i = 0; i < field.length; ++i)
        {
            if (field[i] != 0)
            {
                GameFieldCanvasContext.fillStyle = NotEmptyFieldBackgroundColor;
                GameFieldCanvasContext.fillStyle = colors.BackgroundColor[Math.pow(2, field[i])];
                GameFieldCanvasContext.fillRect(xOffset + Padding, yOffset + Padding, GetSpecialWidth() - Padding, GetSpecialHeight() - Padding);
                GameFieldCanvasContext.fillStyle = NotEmptyFieldFontColor;
                GameFieldCanvasContext.fillStyle = colors.fontColor[Math.pow(2, field[i])];
                GameFieldCanvasContext.fillText(Math.pow(2, field[i]), (xOffset + Padding / 2) + (GetSpecialWidth() / 2), yOffset + Padding / 2 + (GetSpecialHeight() / 2));
            }
            else
            {
                GameFieldCanvasContext.fillStyle = ['#D3A695'];
                GameFieldCanvasContext.fillRect(xOffset + Padding, yOffset + Padding, GetSpecialWidth() - Padding, GetSpecialHeight() - Padding);
            }
            xOffset += GetSpecialWidth();
            if (xOffset >= GameFieldCanvas.width - Padding - lineElementsCount)
            {
                xOffset = 0;
                yOffset += GetSpecialHeight();
            }
        }
    }
    InitRender();
    DrawScoreBar();
    DrawGameField();
}

document.addEventListener("keydown", KeyDownEventListner);
Render();