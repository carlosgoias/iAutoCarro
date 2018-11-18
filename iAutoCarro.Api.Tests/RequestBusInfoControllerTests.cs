namespace iAutoCarro.Api.Tests
{
    using FluentAssertions;
    using iAutoCarro.Api.Controllers;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System;
    using System.Threading.Tasks;


    [TestClass]
    public class RequestBusInfoControllerTests
    {
        [TestMethod]
        public void GetResultsWithSuccess()
        {
            //ASSETS
            var controller = new RequestBusInfoController();
            
            //ACT
            var actual = Task.Run(async () => await controller.Get("LION1").ConfigureAwait(false)).GetAwaiter().GetResult();
            
            //ASSERTS
            actual.Should().NotBeNull();
            actual.Should().HaveCount(1);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentNullException))]
        public void GetResultWithFail()
        {
            //ASSETS
            var controller = new RequestBusInfoController();

            //ACT
            var actual = Task.Run(async () => await controller.Get("").ConfigureAwait(false)).GetAwaiter().GetResult();

            
        }
    }
}
