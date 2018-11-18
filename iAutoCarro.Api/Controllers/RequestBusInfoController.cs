
namespace iAutoCarro.Api.Controllers
{
    using HtmlAgilityPack;
    using iAutoCarro.Api.Entities;
    using Microsoft.AspNetCore.Mvc;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Net;
    using System.Text;
    using System.Text.RegularExpressions;
    using System.Threading.Tasks;

    [Route("api/[controller]")]
    [ApiController]
    public class RequestBusInfoController : ControllerBase
    {
        // GET: api/RequestBusInfo
        [HttpGet]
        public async Task<IEnumerable<Bus>> Get(string codigo)
        {
            if(string.IsNullOrEmpty(codigo))
                throw new ArgumentNullException(codigo);

            //var data = getDataFromHtml(codigo);
            
            var data = getDataFromFile(codigo);

            return populateBuses(data);
        }

        #region Private
        private IEnumerable<Bus> populateBuses(string data)
        {
            List<Bus> buses = new List<Bus>();
            HtmlDocument doc = new HtmlDocument();
            doc.LoadHtml(data);

            var table = doc.GetElementbyId("smsBusResults");

            try
            {
                var query = from row in table.SelectNodes("tr").Where(d => d.HasClass("even"))
                            select new { Table = table.Id, CellText = row.InnerText };


                var datax = string.Empty;



                foreach (var cell in query)
                {
                    datax = cell.CellText.Replace("&nbsp;", string.Empty).Replace("\t", string.Empty).Replace("\n", string.Empty).Replace("\r\r", "\r");

                    var dados = datax.Split("\r");

                    int resultNumber;

                    Int32.TryParse(dados[1].Split(" ")[0], out resultNumber);

                    Bus bus = new Bus
                    {
                        Number = resultNumber,
                        Line = dados[1].Split(" ")[1],
                        EstimatedTime = convertEstimatedTime(dados[2]),
                        WaitingTime = convertToWaitingTime(dados[3])
                    };

                    buses.Add(bus);
                }
            }
            catch (Exception)
            {
                //THERE'S NO BUS LEFT
            }

            return buses;
        }
        private string getDataFromHtml(string codigo)
        {
            string urlAddress = $"https://www.stcp.pt/pt/itinerarium/soapclient.php?codigo={codigo}&linha=0";

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(urlAddress);
            HttpWebResponse response = (HttpWebResponse)request.GetResponseAsync().GetAwaiter().GetResult();
            request.Method = "GET";

            string data = string.Empty;
            if (response.StatusCode == HttpStatusCode.OK)
            {
                Stream receiveStream = response.GetResponseStream();
                StreamReader readStream = null;

                if (response.CharacterSet == null)
                {
                    readStream = new StreamReader(receiveStream);
                }
                else
                {
                    readStream = new StreamReader(receiveStream, Encoding.GetEncoding(response.CharacterSet));
                }

                data = readStream.ReadToEnd();

                response.Close();
                readStream.Close();
            }
            return data;
        }
                
        private string getDataFromFile(string codigo)
        {

            string text = System.IO.File.ReadAllText($"Mocks\\{codigo}.html");


            return text;
        }

        private TimeSpan convertToWaitingTime(string data)
        {
            int min = 0;

            try
            {
                var clean = Regex.Replace(data, "[^0-9.]", "");

                min = Convert.ToInt16(clean);
            }
            catch (Exception)
            {
                //Not found so it must have arrived
            }

            return new TimeSpan(0, min, 0);
        }

        private TimeSpan convertEstimatedTime(string data)
        {
            int hour = 0;


            int min = 0;

            try
            {
                hour = Convert.ToInt16(data.Split(":").FirstOrDefault());

                min = Convert.ToInt16(data.Split(":").LastOrDefault());
            }

            catch (Exception)
            {
                //Not found so it must have arrived
            }

            return new TimeSpan(hour, min, 0);
        }

        #endregion

    }
}
