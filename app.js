// app.js - 修改后的前端代码（安全版本）
document.getElementById("analyzeBtn").addEventListener("click", generateScore);
document.getElementById("screenshotBtn").addEventListener("click", takeScreenshot);

async function generateScore() {
  const input = document.getElementById("inputText").value.trim();
  const lang = document.documentElement.lang;
  const resultCard = document.getElementById("resultCard");
  const resultText = document.getElementById("resultText");

  if (!input) {
    alert(lang === "zh" ? "请输入内容" : "Please enter something.");
    return;
  }

  resultText.innerHTML = (lang === "zh" ? "分析中(请等待一分钟)..." : "Analyzing(Please wait for a minute)...");
  resultCard.classList.remove("hidden");

  try {
    // 🔒 现在调用我们自己的安全API，而不是直接调用OpenAI
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        input: input,
        lang: lang
      })
    });

    const result = await response.json();
    
    if (result.success) {
      window.lastResult = result.data; // 存储最后的结果
      renderStructuredResult(result.data);
    } else {
      // 错误处理
      resultText.innerHTML = `<div style='color:red;'>⚠️ ${result.error || 'Unknown error'}:</div><pre>${result.content || result.message || ''}</pre>`;
    }

  } catch (error) {
    console.error('Network error:', error);
    resultText.innerHTML = `<div style='color:red;'>⚠️ ${lang === "zh" ? "网络错误，请检查服务器是否运行" : "Network error, please check if server is running"}</div>`;
  }
}

function renderStructuredResult(data) {
  const resultText = document.getElementById("resultText");
  let html = `<h2>${data.title}</h2>`;

  if (data.top_charts) {
    html += `<div class="chart">
      <div>
        <div style="font-weight:bold">${data.top_charts.left_chart.label}</div>
        <canvas id="circleChart" width="140" height="140"></canvas>
      </div>
      <div>
        <div style="font-weight:bold">${data.top_charts.right_chart.label}</div>
        <div style="margin-top:12px; background:rgba(255,255,255,0.1); border-radius:12px; width:220px; height:24px; position:relative; border: 1px solid rgba(255,255,255,0.2); overflow: hidden;">
          <div style="width:${data.top_charts.right_chart.percentile}%; background:linear-gradient(90deg, #6c63ff, #ff6b9d); height:100%; border-radius:11px; transition: width 0.3s ease;"></div>
          <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); color:#fff; font-weight:bold; font-size:14px; z-index:10; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">${data.top_charts.right_chart.percentile}%</div>
        </div>
      </div>
    </div>`;
  }

  html += `<div class="slogan-block"><h3>${data.slogan.title}</h3><p>${data.slogan.text}</p></div>`;

  data.cards.forEach(card => {
    html += `<div class="result-block"><h3>${card.title}</h3>`;
    if (card.type === "score_analysis") {
      html += `<p>${card.score}</p><p>${card.meaning}</p>`;
      card.dimensions.forEach(dim => {
        html += `<p><strong>${dim.title}</strong>: ${dim.description}</p>`;
      });
    } else if (card.type === "easy_to_replace" || card.type === "hard_to_replace") {
      html += "<ul>";
      card.tasks.forEach(task => html += `<li>${task}</li>`);
      html += "</ul>";
    } else if (card.type === "recommended_tools") {
      html += "<ul>";
      card.tools.forEach(tool => {
        html += `<li><a href="${tool.url}" target="_blank">${tool.name}</a>: ${tool.function}</li>`;
      });
      html += "</ul>";
    } else if (card.type === "career_advice") {
      html += "<ul>";
      card.advice.forEach(tip => html += `<li>${tip}</li>`);
      html += "</ul>";
    }
    html += "</div>";
  });

  resultText.innerHTML = html;

  const canvas = document.getElementById("circleChart");
  if (canvas && data.top_charts.left_chart.score) {
    const ctx = canvas.getContext("2d");
    const score = data.top_charts.left_chart.score;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 10;

    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.beginPath();
    ctx.arc(70, 70, 60, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.strokeStyle = "#6c63ff";
    ctx.beginPath();
    ctx.arc(70, 70, 60, -0.5 * Math.PI, (score / 100) * 2 * Math.PI - 0.5 * Math.PI);
    ctx.stroke();

    ctx.font = "16px Inter";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText(score + "/100", 70, 75);
  }
}

function takeScreenshot() {
  const result = document.getElementById("resultCard");
  
  if (result.classList.contains("hidden")) {
    alert(document.documentElement.lang === "zh" ? "请先分析一个职业" : "Please analyze a job first");
    return;
  }

  // Loading提示
  const loadingDiv = document.createElement('div');
  loadingDiv.style.cssText = `
    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
    background: rgba(0,0,0,0.8); color: white; padding: 20px; border-radius: 10px;
    z-index: 9999; font-size: 16px;
  `;
  loadingDiv.textContent = document.documentElement.lang === "zh" ? "正在生成截图..." : "Generating screenshot...";
  document.body.appendChild(loadingDiv);

  // 创建截图专用容器
  const screenshotContainer = document.createElement('div');
  screenshotContainer.style.cssText = `
    position: fixed; top: -9999px; left: 0;
    width: 850px; min-height: 600px;
    background: #1a1a2e;
    padding: 40px; border-radius: 20px; color: white;
    font-family: 'Inter', Arial, sans-serif; font-size: 16px; line-height: 1.6;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  `;

  // 获取数据
  const data = window.lastResult;
  if (!data) {
    document.body.removeChild(loadingDiv);
    alert("数据不完整，请重新分析");
    return;
  }

  // 手动构建HTML内容
  let html = `
    <h2 style="font-size: 28px; margin-bottom: 25px; color: #ffffff; 
               font-weight: 700; text-align: center; text-shadow: 0 0 20px rgba(108, 99, 255, 0.5);">${data.title}</h2>
    
    <div style="display: flex; justify-content: space-around; align-items: center; margin-bottom: 30px; 
                padding: 25px; background: rgba(255,255,255,0.1); border-radius: 20px; 
                border: 1px solid rgba(255,255,255,0.2);">
      
      <div style="text-align: center;">
        <div style="font-weight: 700; font-size: 16px; margin-bottom: 15px;">${data.top_charts.left_chart.label}</div>
        <canvas id="screenshotChart" width="140" height="140" style="border-radius: 50%; background: rgba(255,255,255,0.05);"></canvas>
      </div>
      
      <div style="text-align: center;">
        <div style="font-weight: 700; font-size: 16px; margin-bottom: 15px;">${data.top_charts.right_chart.label}</div>
        <div style="margin-top: 12px; background: rgba(255,255,255,0.2); border-radius: 12px; 
                    width: 220px; height: 24px; position: relative; border: 1px solid rgba(255,255,255,0.3);">
          <div style="width: ${data.top_charts.right_chart.percentile}%; 
                      background: linear-gradient(90deg, #6c63ff, #ff6b9d); 
                      height: 100%; border-radius: 11px; position: relative; overflow: hidden;">
          </div>
          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                      color: #fff; font-weight: bold; font-size: 14px; z-index: 2;">
            ${data.top_charts.right_chart.percentile}%
          </div>
        </div>
      </div>
    </div>

    <div style="background: rgba(255,255,255,0.08); padding: 25px; margin-bottom: 20px; 
                border-radius: 20px; border: 1px solid rgba(255,255,255,0.15); 
                border-left: 4px solid #6c63ff;">
      <h3 style="margin: 0 0 15px 0; font-size: 20px; font-weight: 600;">${data.slogan.title}</h3>
      <p style="margin: 0; color: rgba(255,255,255,0.9);">${data.slogan.text}</p>
    </div>
  `;

  // 添加卡片内容
  data.cards.forEach(card => {
    html += `
      <div style="background: rgba(255,255,255,0.08); padding: 25px; margin-bottom: 20px; 
                  border-radius: 20px; border: 1px solid rgba(255,255,255,0.15); 
                  border-left: 4px solid #ff6b9d; position: relative;">
        <h3 style="margin: 0 0 15px 0; font-size: 20px; font-weight: 600; color: #ffffff;">${card.title}</h3>
    `;

    if (card.type === "score_analysis") {
      html += `<p style="margin-bottom: 12px; color: rgba(255,255,255,0.9);">${card.score}</p>`;
      html += `<p style="margin-bottom: 12px; color: rgba(255,255,255,0.9);">${card.meaning}</p>`;
      card.dimensions.forEach(dim => {
        html += `<p style="margin-bottom: 8px; color: rgba(255,255,255,0.9);">
                   <strong style="color: #4ecdc4;">${dim.title}</strong>: ${dim.description}
                 </p>`;
      });
    } else if (card.type === "easy_to_replace" || card.type === "hard_to_replace") {
      html += "<ul style='padding-left: 20px; margin: 0;'>";
      card.tasks.forEach(task => {
        html += `<li style="margin-bottom: 8px; color: rgba(255,255,255,0.9);">${task}</li>`;
      });
      html += "</ul>";
    } else if (card.type === "recommended_tools") {
      html += "<ul style='padding-left: 20px; margin: 0;'>";
      card.tools.forEach(tool => {
        html += `<li style="margin-bottom: 8px; color: rgba(255,255,255,0.9);">
                   <strong style="color: #6c63ff;">${tool.name}</strong>: ${tool.function}
                 </li>`;
      });
      html += "</ul>";
    } else if (card.type === "career_advice") {
      html += "<ul style='padding-left: 20px; margin: 0;'>";
      card.advice.forEach(tip => {
        html += `<li style="margin-bottom: 8px; color: rgba(255,255,255,0.9);">${tip}</li>`;
      });
      html += "</ul>";
    }
    html += "</div>";
  });

  screenshotContainer.innerHTML = html;
  document.body.appendChild(screenshotContainer);

  // 绘制圆形图表
  setTimeout(() => {
    const canvas = screenshotContainer.querySelector('#screenshotChart');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const score = data.top_charts.left_chart.score;
      
      // 清除画布
      ctx.clearRect(0, 0, 140, 140);
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';

      // 背景圆圈
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.beginPath();
      ctx.arc(70, 70, 60, 0, 2 * Math.PI);
      ctx.stroke();

      // 进度圆圈
      ctx.strokeStyle = "#6c63ff";
      ctx.beginPath();
      ctx.arc(70, 70, 60, -0.5 * Math.PI, (score / 100) * 2 * Math.PI - 0.5 * Math.PI);
      ctx.stroke();

      // 中心文字
      ctx.font = "bold 18px Inter";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${score}/100`, 70, 70);
    }

    // 执行截图
    html2canvas(screenshotContainer, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      width: 900,
      height: screenshotContainer.offsetHeight
    }).then(canvas => {
      // 清理
      document.body.removeChild(screenshotContainer);
      document.body.removeChild(loadingDiv);
      
      // 下载
      const link = document.createElement("a");
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      link.download = `ai-survival-analysis-${timestamp}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      
      // 成功提示
      const successDiv = document.createElement('div');
      successDiv.style.cssText = `
        position: fixed; top: 20px; right: 20px; background: #4CAF50; color: white;
        padding: 15px 20px; border-radius: 8px; z-index: 9999; font-size: 14px;
      `;
      successDiv.innerHTML = `✅ ${document.documentElement.lang === "zh" ? "截图已保存" : "Screenshot saved"}`;
      document.body.appendChild(successDiv);
      
      setTimeout(() => {
        if (document.body.contains(successDiv)) {
          document.body.removeChild(successDiv);
        }
      }, 3000);
      
    }).catch(error => {
      // 错误处理
      if (document.body.contains(screenshotContainer)) {
        document.body.removeChild(screenshotContainer);
      }
      if (document.body.contains(loadingDiv)) {
        document.body.removeChild(loadingDiv);
      }
      console.error('截图失败:', error);
      alert(document.documentElement.lang === "zh" ? "截图失败，请重试" : "Screenshot failed, please try again");
    });
  }, 100);
}